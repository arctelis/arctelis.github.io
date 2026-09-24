import { describe, expect, it } from 'vitest'
import { monthlyRate } from './interest'

describe('monthlyRate', () => {
  it('converts 12% per year to 1% per month', () => {
    expect(monthlyRate(12)).toBeCloseTo(0.01, 10)
  })

  it('converts 7.5% per year to 0.625% per month', () => {
    expect(monthlyRate(7.5)).toBeCloseTo(0.00625, 10)
  })

  it('returns 0 for a 0% loan', () => {
    expect(monthlyRate(0)).toBe(0)
  })
})
