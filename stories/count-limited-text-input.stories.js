// https://github.com/EnCiv/undebate-ssp/issues/8

import React, { useState } from 'react'

import CountLimitedTextInput from '../app/components/count-limited-text-input'

export default {
    title: 'Count Limited Text Input',
    component: CountLimitedTextInput,
    argTypes: {},
}

const Template = args => {
    const [validity, setValidity] = useState({ valid: false, value: '' })
    return (
        <div>
            <CountLimitedTextInput {...args} onDone={v => setValidity(v)} />
            <p>Is valid: {validity.valid ? 'True' : 'False'}</p>
            <p>Value: {validity.value}</p>
        </div>
    )
}

export const CountLimitedTextInputTest = Template.bind({})

CountLimitedTextInputTest.args = {
    name: 'Question 2',
    maxCount: 250,
    defaultValue: '',
}
