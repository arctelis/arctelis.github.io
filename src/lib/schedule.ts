import { annuityPayment } from './annuity'
import { monthlyRate } from './interest'
import type { LoanParams, ScheduleRow } from './types'

export function buildSchedule(loan: LoanParams): ScheduleRow[] {
  const rate = monthlyRate(loan.annualRatePercent)
  const installment = annuityPayment(loan.principal, rate, loan.termMonths)

  const rows: ScheduleRow[] = []
  let balance = loan.principal

  for (let month = 1; month <= loan.termMonths; month++) {
    const interestPart = balance * rate
    // Math.min guards the last month against floating-point leftovers.
    const principalPart = Math.min(installment - interestPart, balance)
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
