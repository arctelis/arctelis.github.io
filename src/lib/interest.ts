// Converts a nominal annual rate given in percent (e.g. 7.5) to a monthly rate
// as a fraction (e.g. 0.00625). Simplification: every month is 1/12 of a year.
export function monthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12
}
