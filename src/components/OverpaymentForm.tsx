import {
  addOneTimeRow,
  removeOneTimeRow,
  updateOneTimeRow,
  type OverpaymentFormValues,
} from '../lib/overpaymentForm'

interface OverpaymentFormProps {
  values: OverpaymentFormValues
  onChange: (values: OverpaymentFormValues) => void
}

function OverpaymentForm({ values, onChange }: OverpaymentFormProps) {
  return (
    <form className="card form-card" onSubmit={(event) => event.preventDefault()}>
      <h2 className="card-title">Nadpłaty</h2>

      <fieldset className="field">
        <legend className="field-label">Po nadpłacie bank ma</legend>
        <div className="segmented">
          <label>
            <input
              type="radio"
              name="overpaymentEffect"
              checked={values.effect === 'shortenTerm'}
              onChange={() => onChange({ ...values, effect: 'shortenTerm' })}
            />
            <span>Skrócić okres</span>
          </label>
          <label>
            <input
              type="radio"
              name="overpaymentEffect"
              checked={values.effect === 'lowerInstallment'}
              onChange={() => onChange({ ...values, effect: 'lowerInstallment' })}
            />
            <span>Obniżyć ratę</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field-label">Nadpłata co miesiąc</legend>
        <div className="field-row">
          <span className="input-wrap">
            <input
              inputMode="decimal"
              aria-label="Kwota nadpłaty co miesiąc"
              placeholder="0"
              value={values.recurringAmount}
              onChange={(event) => onChange({ ...values, recurringAmount: event.target.value })}
            />
            <span className="suffix">zł</span>
          </span>
          <span className="input-wrap">
            <span className="prefix">od raty nr</span>
            <input
              inputMode="numeric"
              aria-label="Od której raty"
              placeholder="1"
              value={values.recurringStartMonth}
              onChange={(event) => onChange({ ...values, recurringStartMonth: event.target.value })}
            />
          </span>
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field-label">Nadpłaty jednorazowe</legend>

        {values.oneTime.length === 0 && <p className="field-hint">Brak nadpłat jednorazowych.</p>}

        {values.oneTime.map((row) => (
          <div className="field-row with-action" key={row.id}>
            <span className="input-wrap">
              <span className="prefix">rata nr</span>
              <input
                inputMode="numeric"
                aria-label="Numer raty"
                value={row.month}
                onChange={(event) => onChange(updateOneTimeRow(values, row.id, { month: event.target.value }))}
              />
            </span>
            <span className="input-wrap">
              <input
                inputMode="decimal"
                aria-label="Kwota nadpłaty"
                value={row.amount}
                onChange={(event) => onChange(updateOneTimeRow(values, row.id, { amount: event.target.value }))}
              />
              <span className="suffix">zł</span>
            </span>
            <button
              type="button"
              className="icon-button"
              aria-label="Usuń nadpłatę"
              onClick={() => onChange(removeOneTimeRow(values, row.id))}
            >
              ×
            </button>
          </div>
        ))}

        <button type="button" className="ghost-button" onClick={() => onChange(addOneTimeRow(values))}>
          + Dodaj nadpłatę
        </button>
      </fieldset>
    </form>
  )
}

export default OverpaymentForm
