import { annuityPayment } from './annuity'
import { monthlyRate } from './interest'
import type { LoanParams, OverpaymentPlan, ScheduleRow } from './types'

// Balances below this are treated as fully repaid (floating-point dust).
const PAID_OFF_EPSILON = 1e-6

const NO_OVERPAYMENTS: OverpaymentPlan = { oneTime: [], recurring: null, effect: 'shortenTerm' }

function overpaymentForMonth(plan: OverpaymentPlan, month: number): number {
  const oneTime = plan.oneTime
    .filter((overpayment) => overpayment.month === month)
    .reduce((total, overpayment) => total + overpayment.amount, 0)
  const recurring = plan.recurring !== null && month >= plan.recurring.startMonth ? plan.recurring.amount : 0
  return oneTime + recurring
}

export function buildSchedule(loan: LoanParams, plan: OverpaymentPlan = NO_OVERPAYMENTS): ScheduleRow[] {
  const rate = monthlyRate(loan.annualRatePercent)
  // Equal installments: fixed total payment. Decreasing: fixed principal part.
  // Both are recalculated after an overpayment when the effect is 'lowerInstallment'.
  let equalInstallment = annuityPayment(loan.principal, rate, loan.termMonths)
  let fixedPrincipalPart = loan.principal / loan.termMonths

  const rows: ScheduleRow[] = []
  let balance = loan.principal

  for (let month = 1; month <= loan.termMonths && balance > PAID_OFF_EPSILON; month++) {
    const interestPart = balance * rate
    const plannedPrincipalPart =
      loan.installmentType === 'equal' ? equalInstallment - interestPart : fixedPrincipalPart
    // Math.min guards the last month against paying more than is left.
    const principalPart = Math.min(plannedPrincipalPart, balance)
    balance -= principalPart

    const overpayment = Math.min(overpaymentForMonth(plan, month), balance)
    balance -= overpayment

    rows.push({
      month,
      installment: principalPart + interestPart,
      principalPart,
      interestPart,
      overpayment,
      balance,
    })

    const monthsLeft = loan.termMonths - month
    if (overpayment > 0 && plan.effect === 'lowerInstallment' && monthsLeft > 0) {
      equalInstallment = annuityPayment(balance, rate, monthsLeft)
      fixedPrincipalPart = balance / monthsLeft
    }
  }

  return rows
}
