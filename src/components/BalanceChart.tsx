import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { yearTicks, type BalancePoint } from '../lib/chartData'
import { formatCompactPLN, formatDuration, formatLoanMonth, formatPLN, formatYearTick } from '../lib/format'
import { AXIS_TICK, CHART_COLORS } from './chartTheme'

interface BalanceChartProps {
  points: BalancePoint[]
  // Month in which the loan with overpayments is fully repaid.
  payoffMonth: number
  monthsSaved: number
}

function BalanceChart({ points, payoffMonth, monthsSaved }: BalanceChartProps) {
  const lastMonth = points.length - 1

  return (
    <figure className="card chart-card">
      <figcaption>
        <p className="eyebrow">Saldo kredytu</p>
        <h2 className="card-title">
          {monthsSaved > 0 ? `Kredyt kończy się ${formatDuration(monthsSaved)} wcześniej` : 'Ile zostało do spłaty'}
        </h2>
        <ul className="chart-legend">
          <li>
            <span className="legend-line" style={{ background: CHART_COLORS.baseline }} />
            Bez nadpłat
          </li>
          <li>
            <span className="legend-line" style={{ background: CHART_COLORS.principal }} />
            Z nadpłatami
          </li>
        </ul>
      </figcaption>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="month"
              type="number"
              domain={[0, lastMonth]}
              ticks={yearTicks(lastMonth)}
              tickFormatter={formatYearTick}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.grid }}
            />
            <YAxis
              tickFormatter={formatCompactPLN}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              separator=": "
              labelFormatter={(month) => formatLoanMonth(Number(month))}
              formatter={(value, name) => [typeof value === 'number' ? formatPLN(value) : '—', name]}
              contentStyle={{ borderColor: CHART_COLORS.grid, borderRadius: 6, fontSize: 13 }}
            />
            <Line
              name="Bez nadpłat"
              dataKey="withoutOverpayments"
              stroke={CHART_COLORS.baseline}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              name="Z nadpłatami"
              dataKey="withOverpayments"
              stroke={CHART_COLORS.principal}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            {monthsSaved > 0 && (
              <ReferenceDot
                x={payoffMonth}
                y={0}
                r={5}
                fill={CHART_COLORS.principal}
                stroke={CHART_COLORS.surface}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

export default BalanceChart
