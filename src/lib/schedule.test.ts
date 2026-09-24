import { describe, expect, it } from 'vitest'
import { buildSchedule } from './schedule'
import type { LoanParams, ScheduleRow } from './types'

const sum = (rows: ScheduleRow[], pick: (row: ScheduleRow) => number): number =>
  rows.reduce((total, row) => total + pick(row), 0)

const mortgage: LoanParams = {
  principal: 300_000,
  annualRatePercent: 7.5,
  termMonths: 360,
  installmentType: 'equal',
}

describe('buildSchedule — equal installments, no overpayments', () => {
  const rows = buildSchedule(mortgage)

  it('has one row per month', () => {
    expect(rows).toHaveLength(360)
    expect(rows[0].month).toBe(1)
    expect(rows[359].month).toBe(360)
  })

  it('keeps the installment constant (PMT)', () => {
    for (const row of rows) {
      expect(row.installment).toBeCloseTo(2097.64, 2)
    }
  })

  it('charges one month of interest on the full principal in month 1', () => {
    expect(rows[0].interestPart).toBeCloseTo(1875, 8)
    expect(rows[0].principalPart).toBeCloseTo(2097.64 - 1875, 2)
  })

  it('repays exactly the principal and ends with zero balance', () => {
    expect(sum(rows, (row) => row.principalPart)).toBeCloseTo(300_000, 6)
    expect(rows[359].balance).toBeCloseTo(0, 6)
  })

  it('total interest = installments paid - principal', () => {
    const totalInterest = sum(rows, (row) => row.interestPart)
    expect(totalInterest).toBeCloseTo(sum(rows, (row) => row.installment) - 300_000, 6)
    expect(totalInterest).toBeCloseTo(455_151.67, 2)
  })

  it('works for a 0% loan', () => {
    const zero = buildSchedule({ ...mortgage, principal: 12_000, annualRatePercent: 0, termMonths: 12 })
    expect(zero.every((row) => row.installment === 1000 && row.interestPart === 0)).toBe(true)
    expect(zero[11].balance).toBe(0)
  })
})

describe('buildSchedule — decreasing installments, no overpayments', () => {
  // 1% per month and a principal part of exactly 1000 keep the numbers round.
  const rows = buildSchedule({
    principal: 120_000,
    annualRatePercent: 12,
    termMonths: 120,
    installmentType: 'decreasing',
  })

  it('has one row per month and ends with zero balance', () => {
    expect(rows).toHaveLength(120)
    expect(rows[119].balance).toBeCloseTo(0, 6)
  })

  it('keeps the principal part constant', () => {
    for (const row of rows) {
      expect(row.principalPart).toBeCloseTo(1000, 8)
    }
  })

  it('starts at principal part + full interest and ends at principal part + last interest', () => {
    expect(rows[0].installment).toBeCloseTo(2200, 8)
    expect(rows[1].installment).toBeCloseTo(2190, 8)
    expect(rows[119].installment).toBeCloseTo(1010, 8)
  })

  it('total interest = r * P * (n + 1) / 2', () => {
    expect(sum(rows, (row) => row.interestPart)).toBeCloseTo(72_600, 6)
  })
})
