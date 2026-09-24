import type { LoanFormValues } from '../lib/loanForm'

interface LoanFormProps {
  values: LoanFormValues
  onChange: (values: LoanFormValues) => void
}

function LoanForm({ values, onChange }: LoanFormProps) {
  return (
    <form className="card form-card" onSubmit={(event) => event.preventDefault()}>
      <h2 className="card-title">Kredyt</h2>

      <label className="field">
        <span className="field-label">Kwota kredytu</span>
        <span className="input-wrap">
          <input
            inputMode="decimal"
            value={values.principal}
            onChange={(event) => onChange({ ...values, principal: event.target.value })}
          />
          <span className="suffix">zł</span>
        </span>
      </label>

      <label className="field">
        <span className="field-label">Oprocentowanie roczne</span>
        <span className="input-wrap">
          <input
            inputMode="decimal"
            value={values.annualRatePercent}
            onChange={(event) => onChange({ ...values, annualRatePercent: event.target.value })}
          />
          <span className="suffix">%</span>
        </span>
      </label>

      <fieldset className="field">
        <legend className="field-label">Okres kredytu</legend>
        <div className="field-row">
          <span className="input-wrap">
            <input
              inputMode="numeric"
              aria-label="Lata"
              value={values.termYears}
              onChange={(event) => onChange({ ...values, termYears: event.target.value })}
            />
            <span className="suffix">lat</span>
          </span>
          <span className="input-wrap">
            <input
              inputMode="numeric"
              aria-label="Miesiące"
              value={values.termMonths}
              onChange={(event) => onChange({ ...values, termMonths: event.target.value })}
            />
            <span className="suffix">mies.</span>
          </span>
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field-label">Rodzaj rat</legend>
        <div className="segmented">
          <label>
            <input
              type="radio"
              name="installmentType"
              checked={values.installmentType === 'equal'}
              onChange={() => onChange({ ...values, installmentType: 'equal' })}
            />
            <span>Równe</span>
          </label>
          <label>
            <input
              type="radio"
              name="installmentType"
              checked={values.installmentType === 'decreasing'}
              onChange={() => onChange({ ...values, installmentType: 'decreasing' })}
            />
            <span>Malejące</span>
          </label>
        </div>
      </fieldset>
    </form>
  )
}

export default LoanForm
