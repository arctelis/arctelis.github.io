import type { InstallmentType, LoanParams } from './types'

// Raw text from the form inputs. Kept as strings so the user can type freely
// (empty field, "7,5", "300 000") without the input fighting back.
export interface LoanFormValues {
  principal: string
  annualRatePercent: string
  termYears: string
  termMonths: string
  installmentType: InstallmentType
}

// Accepts Polish input: decimal comma and spaces as thousands separators.
// Returns NaN for an empty field or anything that is not a number.
export function parseDecimal(text: string): number {
  const normalized = text.replace(/\s/g, '').replace(',', '.')
  if (normalized === '') {
    return NaN
  }
  return Number(normalized)
}

// An empty years/months field means 0 (e.g. "25 years, _ months").
function parseTermPart(text: string): number {
  return text.trim() === '' ? 0 : parseDecimal(text)
}

export function toLoanParams(values: LoanFormValues): LoanParams {
  return {
    principal: parseDecimal(values.principal),
    annualRatePercent: parseDecimal(values.annualRatePercent),
    termMonths: parseTermPart(values.termYears) * 12 + parseTermPart(values.termMonths),
    installmentType: values.installmentType,
  }
}
