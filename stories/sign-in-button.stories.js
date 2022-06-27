// https://github.com/EnCiv/undebate-ssp/issues/14
import component from '../app/components/sign-in-button'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Sign In Button',
    component,
    argTypes: {},
    decorators: [
        Story => (
            <div>
                success@email.com / 'password' will succede
                <br />
                all other combinations will fail
                <Story />
            </div>
        ),
    ],
}

export const Default = mC({})
export const SignUp = mC({ name: 'Sign Up' })
export const Login = mC({ name: 'Login' })
