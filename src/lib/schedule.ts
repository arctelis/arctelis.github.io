import { annuityPayment } from './annuity'
import { monthlyRate } from './interest'
import type { LoanParams, ScheduleRow } from './types'

export function buildSchedule(loan: LoanParams): ScheduleRow[] {
  const rate = monthlyRate(loan.annualRatePercent)
  // Equal installments: fixed total payment. Decreasing: fixed principal part.
  const equalInstallment = annuityPayment(loan.principal, rate, loan.termMonths)
  const fixedPrincipalPart = loan.principal / loan.termMonths

  const rows: ScheduleRow[] = []
  let balance = loan.principal

  for (let month = 1; month <= loan.termMonths; month++) {
    const interestPart = balance * rate
    const plannedPrincipalPart =
      loan.installmentType === 'equal' ? equalInstallment - interestPart : fixedPrincipalPart
    // Math.min guards the last month against floating-point leftovers.
    const principalPart = Math.min(plannedPrincipalPart, balance)
    balance -= principalPart

    rows.push({
      month,
      installment: principalPart + interestPart,
      principalPart,
      interestPart,
      overpayment: 0,
      balance,
    })
  }

  return rows
}
