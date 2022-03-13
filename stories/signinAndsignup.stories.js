import React from 'react'
import SignInAndSignUp from '../app/components/signinAndsignup'

export default {
    title: 'SignInAndSignUp',
    component: SignInAndSignUp,
    argTypes: {},
}

const Template = args => <SignInAndSignUp {...args} />

export const SignInAndSignUpTest = Template.bind({})
SignInAndSignUpTest.args = {}
