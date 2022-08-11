import component from '../app/components/datetime-input'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Datetime Input',
    component,
}

export const Empty = mC({})
export const Blank = mC({ defaultValue: '' })
export const Filled = mC({ defaultValue: '11/26/2022T17:00:00.000Z' })
export const disabled = mC({ defaultValue: '11/26/2022T17:00:00.000Z', disabled: true })
