import makeChapter from './make-chapter'
import component from '../app/components/reset-password'
const mC = makeChapter(component)

export default {
    title: 'ResetPassword',
    component,
    argTypes: {}
}

export const Reset = mC({})
