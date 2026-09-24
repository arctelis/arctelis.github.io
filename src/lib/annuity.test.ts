import { describe, expect, it } from 'vitest'
import { annuityPayment } from './annuity'
import { monthlyRate } from './interest'

// Expected values checked against Excel: =PMT(rate/12; months; -principal)
describe('annuityPayment', () => {
  it('matches PMT for 300 000 at 7.5% over 30 years', () => {
    expect(annuityPayment(300_000, monthlyRate(7.5), 360)).toBeCloseTo(2097.64, 2)
  })

  it('matches PMT for 100 000 at 6% over 10 years', () => {
    expect(annuityPayment(100_000, monthlyRate(6), 120)).toBeCloseTo(1110.21, 2)
  })

  it('splits the principal evenly for a 0% loan', () => {
    expect(annuityPayment(12_000, 0, 12)).toBe(1000)
  })

  it('returns principal plus one month of interest for a 1-month loan', () => {
    expect(annuityPayment(10_000, 0.01, 1)).toBeCloseTo(10_100, 8)
  })
})
