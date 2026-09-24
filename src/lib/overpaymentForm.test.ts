import { describe, expect, it } from 'vitest'
import {
  addOneTimeRow,
  removeOneTimeRow,
  toOverpaymentPlan,
  updateOneTimeRow,
  type OverpaymentFormValues,
} from './overpaymentForm'

const empty: OverpaymentFormValues = {
  effect: 'shortenTerm',
  recurringAmount: '',
  recurringStartMonth: '',
  oneTime: [],
}

describe('one-time rows', () => {
  it('adds empty rows with unique ids', () => {
    const values = addOneTimeRow(addOneTimeRow(empty))
    expect(values.oneTime).toEqual([
      { id: 1, month: '', amount: '' },
      { id: 2, month: '', amount: '' },
    ])
  })

  it('does not reuse the id of a removed row in the middle', () => {
    const three = addOneTimeRow(addOneTimeRow(addOneTimeRow(empty)))
    const withoutMiddle = removeOneTimeRow(three, 2)
    expect(withoutMiddle.oneTime.map((row) => row.id)).toEqual([1, 3])
    expect(addOneTimeRow(withoutMiddle).oneTime.map((row) => row.id)).toEqual([1, 3, 4])
  })

  it('updates only the row with the given id', () => {
    const values = updateOneTimeRow(addOneTimeRow(addOneTimeRow(empty)), 2, { amount: '5000' })
    expect(values.oneTime).toEqual([
      { id: 1, month: '', amount: '' },
      { id: 2, month: '', amount: '5000' },
    ])
  })

  it('does not modify the original values', () => {
    const original = addOneTimeRow(empty)
    updateOneTimeRow(original, 1, { month: '12' })
    removeOneTimeRow(original, 1)
    expect(original.oneTime).toEqual([{ id: 1, month: '', amount: '' }])
  })
})

describe('toOverpaymentPlan', () => {
  it('returns an empty plan for an empty form', () => {
    expect(toOverpaymentPlan(empty)).toEqual({ oneTime: [], recurring: null, effect: 'shortenTerm' })
  })

  it('parses one-time rows and skips incomplete or invalid ones', () => {
    const plan = toOverpaymentPlan({
      ...empty,
      oneTime: [
        { id: 1, month: '12', amount: '20 000' },
        { id: 2, month: '', amount: '1000' },
        { id: 3, month: '24', amount: '' },
        { id: 4, month: '0', amount: '1000' },
        { id: 5, month: '6,5', amount: '1000' },
        { id: 6, month: '36', amount: '-100' },
      ],
    })
    expect(plan.oneTime).toEqual([{ month: 12, amount: 20_000 }])
  })

  it('parses the recurring overpayment; empty start month means month 1', () => {
    expect(toOverpaymentPlan({ ...empty, recurringAmount: '500' }).recurring).toEqual({
      startMonth: 1,
      amount: 500,
    })
    expect(
      toOverpaymentPlan({ ...empty, recurringAmount: '500', recurringStartMonth: '13' }).recurring,
    ).toEqual({ startMonth: 13, amount: 500 })
  })

  it('has no recurring overpayment when the amount is empty or zero', () => {
    expect(toOverpaymentPlan({ ...empty, recurringStartMonth: '13' }).recurring).toBeNull()
    expect(toOverpaymentPlan({ ...empty, recurringAmount: '0' }).recurring).toBeNull()
  })

  it('passes the effect through', () => {
    expect(toOverpaymentPlan({ ...empty, effect: 'lowerInstallment' }).effect).toBe('lowerInstallment')
  })
})
