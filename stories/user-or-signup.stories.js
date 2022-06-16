import makeChapter from './make-chapter'
import component from '../app/components/user-or-signup'
const mC = makeChapter(component)

export default {
    title: 'UserOrSignup',
    component,
    argTypes: {},
}

export const empty = mC({})
export const LoggedIn = mC({ user: { id: '6274ae8bee422b0f9c607b75', email: 'someone@email.com' } })
export const LoggedInLongEmail = mC({
    user: { id: '6274ae8bee422b0f9c607b75', email: 'someone-with-a-login-email@email.com' },
})
