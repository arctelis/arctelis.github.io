import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { YearlyBreakdown } from '../lib/chartData'
import { formatCompactPLN, formatPLN } from '../lib/format'
import { AXIS_TICK, CHART_COLORS } from './chartTheme'

interface PaymentStructureChartProps {
  years: YearlyBreakdown[]
}

// Stack order bottom -> top: principal, overpayment, interest.
const SERIES = [
  { key: 'principal', name: 'Kapitał', color: CHART_COLORS.principal },
  { key: 'overpayment', name: 'Nadpłaty', color: CHART_COLORS.overpayment },
  { key: 'interest', name: 'Odsetki', color: CHART_COLORS.interest },
] as const

function PaymentStructureChart({ years }: PaymentStructureChartProps) {
  return (
    <figure className="card chart-card">
      <figcaption>
        <p className="eyebrow">Struktura spłat rok po roku</p>
        <h2 className="card-title">Na co idą Twoje pieniądze</h2>
        <ul className="chart-legend">
          {SERIES.map((series) => (
            <li key={series.key}>
              <span className="legend-swatch" style={{ background: series.color }} />
              {series.name}
            </li>
          ))}
        </ul>
      </figcaption>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={years} margin={{ top: 12, right: 16, bottom: 0, left: 0 }} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="year"
              tickFormatter={(year: number) => `${year}`}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.grid }}
              minTickGap={8}
            />
            <YAxis tickFormatter={formatCompactPLN} tick={AXIS_TICK} tickLine={false} axisLine={false} width={80} />
            <Tooltip
              separator=": "
              cursor={{ fill: CHART_COLORS.grid, opacity: 0.6 }}
              labelFormatter={(year) => `Rok ${year}`}
              formatter={(value, name) => [typeof value === 'number' ? formatPLN(value) : '—', name]}
              contentStyle={{ borderColor: CHART_COLORS.grid, borderRadius: 6, fontSize: 13 }}
            />
            {SERIES.map((series) => (
              <Bar
                key={series.key}
                name={series.name}
                dataKey={series.key}
                stackId="payments"
                fill={series.color}
                stroke={CHART_COLORS.surface}
                strokeWidth={1}
                maxBarSize={24}
                radius={series.key === 'interest' ? [4, 4, 0, 0] : 0}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

export default PaymentStructureChart
