// Chart colors. Recharts needs real color values (not CSS classes), so they live here.
// Checked with the dataviz palette validator (lightness, chroma, colorblind separation, contrast).
export const CHART_COLORS = {
  principal: '#9B2F2F',
  interest: '#C7862A',
  overpayment: '#16876A',
  // The "without overpayments" line is a muted reference, not a competing series.
  baseline: '#A89D98',
  grid: '#EBE5E0',
  axisText: '#6F6360',
  surface: '#FFFFFF',
}

export const AXIS_TICK = { fill: CHART_COLORS.axisText, fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }
