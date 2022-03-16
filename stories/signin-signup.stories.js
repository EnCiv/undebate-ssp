//https://github.com/EnCiv/undebate-ssp/issues/108
import React from 'react'
import SignInSignUp from '../app/components/signin-signup'

export default {
    title: 'SignInSignUp',
    component: SignInSignUp,
    argTypes: {},
}

//   const [state, methods] = useAuth(onChange, {})
//   const [authenticated, setAuthenticated] = useState(false)
//   useEffect(() => {
//     window.socket = {
//       emit: (handle, email, href, cb) => {
//         if (handle !== 'send-password') console.error('emit expected send-password, got:', handle)
//         if (email === 'success@email.com') setTimeout(() => cb({ error: '' }), 1000)
//         else setTimeout(() => cb({ error: 'User not found' }), 1000)
//       },
//       onHandlers: {},
//       on: (handle, handler) => {
//         window.socket.onHandlers[handle] = handler
//       },
//       close: () => {
//         if (window.socket.onHandlers.connect) setTimeout(window.socket.onHandlers.connect, 1000)
//         else console.error('No connect handler registered')
//       },
//       removeListener: () => {},
//     }
//   }, [])

const Template = args => <SignInSignUp {...args} />

export const SignInSignUpTest = Template.bind({})
SignInSignUpTest.args = {}
