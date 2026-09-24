import { describe, expect, it } from 'vitest'
import { parseDecimal, toLoanParams, type LoanFormValues } from './loanForm'

describe('parseDecimal', () => {
  it.each([
    ['7.5', 7.5],
    ['7,5', 7.5],
    ['300000', 300_000],
    ['300 000', 300_000],
    ['300 000,50', 300_000.5],
    [' 12 ', 12],
  ])('"%s" -> %d', (text, expected) => {
    expect(parseDecimal(text)).toBe(expected)
  })

  it.each(['', '   ', 'abc', '7,5,1'])('"%s" -> NaN', (text) => {
    expect(parseDecimal(text)).toBeNaN()
  })
})

describe('toLoanParams', () => {
  const values: LoanFormValues = {
    principal: '300 000',
    annualRatePercent: '7,5',
    termYears: '25',
    termMonths: '6',
    installmentType: 'decreasing',
  }

  it('converts form text to numbers and the term to months', () => {
    expect(toLoanParams(values)).toEqual({
      principal: 300_000,
      annualRatePercent: 7.5,
      termMonths: 306,
      installmentType: 'decreasing',
    })
  })

  it('treats an empty years or months field as 0', () => {
    expect(toLoanParams({ ...values, termMonths: '' }).termMonths).toBe(300)
    expect(toLoanParams({ ...values, termYears: '' }).termMonths).toBe(6)
  })

  it('keeps invalid numbers as NaN (validation comes later)', () => {
    expect(toLoanParams({ ...values, principal: '' }).principal).toBeNaN()
  })
})
