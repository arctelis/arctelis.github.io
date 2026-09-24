// Formatters are created once and reused — building an Intl formatter is relatively slow.
const plnFormatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
const percentFormatter = new Intl.NumberFormat('pl-PL', { style: 'percent', maximumFractionDigits: 2 })
const pluralRules = new Intl.PluralRules('pl-PL')

export function formatPLN(amount: number): string {
  return plnFormatter.format(amount)
}

// Takes percent as used in LoanParams (7.5 means 7.5%).
export function formatPercent(percent: number): string {
  return percentFormatter.format(percent / 100)
}

// Polish has three plural forms: 1 miesiąc, 2 miesiące, 5 miesięcy.
const MONTH_FORMS: Record<Intl.LDMLPluralRule, string> = {
  zero: 'miesięcy',
  one: 'miesiąc',
  two: 'miesiące',
  few: 'miesiące',
  many: 'miesięcy',
  other: 'miesiąca',
}

export function formatMonths(months: number): string {
  return `${months} ${MONTH_FORMS[pluralRules.select(months)]}`
}
