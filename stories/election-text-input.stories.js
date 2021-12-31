// https://github.com/EnCiv/undebate-ssp/issues/9

import React, { useState } from 'react'
import ElectionTextInput from '../app/components/election-text-input'

export default {
    title: 'Election Text Input',
    component: ElectionTextInput,
}

const Template = args => (
    <div style={{ width: '50%' }}>
        <ElectionTextInput name='Input Name' {...args} />
    </div>
)

export const Default = Template.bind({})
Default.args = {
    name: 'Input Name',
    defaultValue: '',
    checkIsEmail: false,
}

export const DefaultValueSet = Template.bind({})
DefaultValueSet.args = {
    name: 'Input Name',
    defaultValue: 'Default value',
    checkIsEmail: false,
}

const ValidationTemplate = args => {
    const [doneState, setDoneState] = useState({ valid: false, value: '' })
    return (
        <div style={{ width: '50%' }}>
            <ElectionTextInput onDone={done => setDoneState(done)} {...args} />
            <div
                style={{
                    margin: '10px',
                }}
            >
                Is valid: {`${doneState.valid}`}
            </div>
        </div>
    )
}

export const EmailValidation = ValidationTemplate.bind({})

EmailValidation.args = {
    name: 'Email Address',
    defaultValue: 'user@example.com',
    checkIsEmail: true,
}

export const IsDoneValidation = ValidationTemplate.bind({})

IsDoneValidation.args = {
    name: 'Name',
    defaultValue: 'Default value',
    checkIsEmail: false,
}
