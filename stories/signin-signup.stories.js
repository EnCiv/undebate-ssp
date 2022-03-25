//https://github.com/EnCiv/undebate-ssp/issues/108
import React from 'react'
import SignInSignUp from '../app/components/signin-signup'

export default {
    title: 'SignInSignUp',
    component: SignInSignUp,
    argTypes: {},
}

const Template = args => <SignInSignUp {...args} />

export const SignInSignUpTest = Template.bind({})
SignInSignUpTest.args = {}
