import { describe, expect, it } from 'vitest'
import { formatMonths, formatPercent, formatPLN } from './format'

// Intl uses a non-breaking space (U+00A0) as the thousands separator and before "zł".
const NBSP = ' '

describe('formatPLN', () => {
  it('rounds to grosze and adds the currency', () => {
    expect(formatPLN(12_345.678)).toBe(`12${NBSP}345,68${NBSP}zł`)
  })

  it('does not group 4-digit amounts (Polish typography rule)', () => {
    expect(formatPLN(1234.5)).toBe(`1234,50${NBSP}zł`)
  })

  it('formats zero', () => {
    expect(formatPLN(0)).toBe(`0,00${NBSP}zł`)
  })
})

describe('formatPercent', () => {
  it('uses a decimal comma', () => {
    expect(formatPercent(7.5)).toBe('7,5%')
  })

  it('keeps at most two decimals', () => {
    expect(formatPercent(6.789)).toBe('6,79%')
  })
})

describe('formatMonths', () => {
  it.each([
    [1, '1 miesiąc'],
    [2, '2 miesiące'],
    [4, '4 miesiące'],
    [5, '5 miesięcy'],
    [12, '12 miesięcy'],
    [22, '22 miesiące'],
    [25, '25 miesięcy'],
    [0, '0 miesięcy'],
  ])('%i -> %s', (months, expected) => {
    expect(formatMonths(months)).toBe(expected)
  })
})
