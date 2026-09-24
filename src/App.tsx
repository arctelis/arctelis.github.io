import { useState } from 'react'
import LoanForm from './components/LoanForm'
import { formatMonths, formatPercent, formatPLN } from './lib/format'
import { toLoanParams, type LoanFormValues } from './lib/loanForm'
import { buildSchedule } from './lib/schedule'

const DEFAULT_VALUES: LoanFormValues = {
  principal: '300 000',
  annualRatePercent: '7,5',
  termYears: '30',
  termMonths: '0',
  installmentType: 'equal',
}

function App() {
  const [values, setValues] = useState<LoanFormValues>(DEFAULT_VALUES)

  const loan = toLoanParams(values)
  const schedule = buildSchedule(loan)
  const firstInstallment = schedule.length > 0 ? schedule[0].installment : NaN

  return (
    <>
      <header className="site-header">
        <div className="container">
          <span className="brand">Nadpłata</span>
        </div>
      </header>

      <main className="container hero">
        <section className="hero-intro">
          <p className="eyebrow">Kalkulator nadpłaty kredytu</p>
          <h1>Ile zaoszczędzisz, nadpłacając kredyt?</h1>
          <p className="lead">
            Wpisz parametry kredytu i sprawdź ratę. Za chwilę dodamy nadpłaty i porównanie odsetek.
          </p>
          <LoanForm values={values} onChange={setValues} />
        </section>

        <aside className="card result-panel">
          <p className="eyebrow">Pierwsza rata</p>
          <p className="result-amount">
            {Number.isFinite(firstInstallment) ? formatPLN(firstInstallment) : '—'}
          </p>
          <p className="result-meta">
            {values.installmentType === 'equal' ? 'Raty równe' : 'Raty malejące'}
            {Number.isFinite(loan.termMonths) && ` · ${formatMonths(loan.termMonths)}`}
            {Number.isFinite(loan.annualRatePercent) && ` · ${formatPercent(loan.annualRatePercent)}`}
          </p>
        </aside>
      </main>
    </>
  )
}

export default App
