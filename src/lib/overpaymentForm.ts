import { parseDecimal } from './loanForm'
import type { OneTimeOverpayment, OverpaymentEffect, OverpaymentPlan } from './types'

// One row of the one-time overpayments list. The id never changes, so React
// can tell rows apart even after one in the middle is removed.
export interface OneTimeOverpaymentRow {
  id: number
  month: string
  amount: string
}

// Raw text from the overpayments form, like LoanFormValues.
export interface OverpaymentFormValues {
  effect: OverpaymentEffect
  recurringAmount: string
  recurringStartMonth: string
  oneTime: OneTimeOverpaymentRow[]
}

export function addOneTimeRow(values: OverpaymentFormValues): OverpaymentFormValues {
  const nextId = Math.max(0, ...values.oneTime.map((row) => row.id)) + 1
  return { ...values, oneTime: [...values.oneTime, { id: nextId, month: '', amount: '' }] }
}

export function updateOneTimeRow(
  values: OverpaymentFormValues,
  id: number,
  changes: Partial<Omit<OneTimeOverpaymentRow, 'id'>>,
): OverpaymentFormValues {
  return {
    ...values,
    oneTime: values.oneTime.map((row) => (row.id === id ? { ...row, ...changes } : row)),
  }
}

export function removeOneTimeRow(values: OverpaymentFormValues, id: number): OverpaymentFormValues {
  return { ...values, oneTime: values.oneTime.filter((row) => row.id !== id) }
}

const isValidMonth = (month: number): boolean => Number.isInteger(month) && month >= 1
const isValidAmount = (amount: number): boolean => Number.isFinite(amount) && amount > 0

// Incomplete or invalid rows are skipped for now; step 17 adds proper validation messages.
export function toOverpaymentPlan(values: OverpaymentFormValues): OverpaymentPlan {
  const oneTime: OneTimeOverpayment[] = values.oneTime
    .map((row) => ({ month: parseDecimal(row.month), amount: parseDecimal(row.amount) }))
    .filter((overpayment) => isValidMonth(overpayment.month) && isValidAmount(overpayment.amount))

  const recurringAmount = parseDecimal(values.recurringAmount)
  // An empty "from month" field means "from the first installment".
  const recurringStartMonth =
    values.recurringStartMonth.trim() === '' ? 1 : parseDecimal(values.recurringStartMonth)
  const recurring =
    isValidAmount(recurringAmount) && isValidMonth(recurringStartMonth)
      ? { startMonth: recurringStartMonth, amount: recurringAmount }
      : null

  return { oneTime, recurring, effect: values.effect }
}
