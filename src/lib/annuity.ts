// Equal (annuity) installment — the same result as Excel's PMT, but positive.
// monthlyRate is a fraction (0.00625), not percent.
export function annuityPayment(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) {
    return principal / months
  }
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}
