import makeChapter from './make-chapter'
import component from '../app/components/signin-signup'
const mC = makeChapter(component)

export default {
    title: 'SignInSignUp',
    component,
    argTypes: {},
}

export const empty = mC({})
export const SignUp = mC({ startTab: 'Sign Up' })
export const LoginIn = mC({ startTab: 'Log In' })
