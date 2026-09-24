import { describe, expect, it } from 'vitest'
import { buildSchedule } from './schedule'
import type { LoanParams, OverpaymentPlan, ScheduleRow } from './types'

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

describe('buildSchedule — one-time overpayment', () => {
  const decreasing: LoanParams = {
    principal: 120_000,
    annualRatePercent: 12,
    termMonths: 120,
    installmentType: 'decreasing',
  }
  const oneTime = [{ month: 10, amount: 10_000 }]

  it('an empty plan gives the same schedule as no plan', () => {
    expect(buildSchedule(mortgage, { oneTime: [], recurring: null, effect: 'shortenTerm' })).toEqual(
      buildSchedule(mortgage),
    )
  })

  it('records the overpayment in its month and lowers the balance', () => {
    const rows = buildSchedule(decreasing, { oneTime, recurring: null, effect: 'shortenTerm' })
    expect(rows[9].overpayment).toBe(10_000)
    expect(rows[9].balance).toBeCloseTo(100_000, 6)
    expect(rows.filter((row) => row.overpayment > 0)).toHaveLength(1)
  })

  describe('decreasing installments', () => {
    it('shortenTerm: same principal part, 10 months shorter', () => {
      const rows = buildSchedule(decreasing, { oneTime, recurring: null, effect: 'shortenTerm' })
      expect(rows).toHaveLength(110)
      expect(rows[109].principalPart).toBeCloseTo(1000, 6)
      expect(rows[109].balance).toBeCloseTo(0, 6)
      // 1% * (120k + 119k + ... + 111k) + 1% * (100k + 99k + ... + 1k)
      expect(sum(rows, (row) => row.interestPart)).toBeCloseTo(11_550 + 50_500, 6)
    })

    it('lowerInstallment: same end date, principal part = 100k / 110', () => {
      const rows = buildSchedule(decreasing, { oneTime, recurring: null, effect: 'lowerInstallment' })
      expect(rows).toHaveLength(120)
      expect(rows[9].principalPart).toBeCloseTo(1000, 6)
      expect(rows[10].principalPart).toBeCloseTo(100_000 / 110, 6)
      expect(rows[119].balance).toBeCloseTo(0, 6)
      // 1% * (120k + ... + 111k) + 1% * 100k * (110 + 109 + ... + 1) / 110
      expect(sum(rows, (row) => row.interestPart)).toBeCloseTo(11_550 + 55_500, 6)
    })
  })

  describe('equal installments', () => {
    const plan = (effect: OverpaymentPlan['effect']): OverpaymentPlan => ({
      oneTime: [{ month: 12, amount: 50_000 }],
      recurring: null,
      effect,
    })

    it('shortenTerm: installment stays at PMT, term matches NPER', () => {
      const rows = buildSchedule(mortgage, plan('shortenTerm'))
      const rate = 0.075 / 12
      const pmt = rows[0].installment
      const balanceAfter = rows[11].balance
      // Excel: =NPER(rate; -pmt; balanceAfter), rounded up to whole months
      const nper = -Math.log(1 - (balanceAfter * rate) / pmt) / Math.log(1 + rate)

      expect(rows).toHaveLength(12 + Math.ceil(nper))
      expect(rows[12].installment).toBeCloseTo(pmt, 8)
      expect(rows[rows.length - 1].balance).toBeCloseTo(0, 6)
      expect(sum(rows, (row) => row.principalPart + row.overpayment)).toBeCloseTo(300_000, 6)
    })

    it('lowerInstallment: term stays 360, new installment = PMT over the remaining 348 months', () => {
      const rows = buildSchedule(mortgage, plan('lowerInstallment'))
      const rate = 0.075 / 12
      const expected = (rows[11].balance * rate) / (1 - (1 + rate) ** -348)

      expect(rows).toHaveLength(360)
      expect(rows[12].installment).toBeCloseTo(expected, 8)
      expect(rows[359].installment).toBeCloseTo(expected, 8)
      expect(rows[359].balance).toBeCloseTo(0, 6)
    })
  })

  it('caps an overpayment larger than the balance and ends the loan', () => {
    const rows = buildSchedule(decreasing, {
      oneTime: [{ month: 3, amount: 1_000_000 }],
      recurring: null,
      effect: 'shortenTerm',
    })
    expect(rows).toHaveLength(3)
    expect(rows[2].overpayment).toBeCloseTo(117_000, 6)
    expect(rows[2].balance).toBe(0)
  })
})
