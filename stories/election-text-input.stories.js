// https://github.com/EnCiv/undebate-ssp/issues/9

import React from 'react'
import ElectionTextInput from '../app/components/election-text-input'

export default {
    title: 'Election Text Input',
    component: ElectionTextInput,
}

const Template = (args, context) => {
    const { onDone } = context
    return (
        <div style={{ width: '50%' }}>
            <ElectionTextInput name='Input Name' onDone={onDone} {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    name: 'Input Name',
    defaultValue: '',
    type: 'test',
}

export const DefaultValueSet = Template.bind({})
DefaultValueSet.args = {
    name: 'Input Name',
    defaultValue: 'Default value',
    type: 'test',
}

export const EmailValidation = Template.bind({})

EmailValidation.args = {
    name: 'Email Address',
    defaultValue: 'user@example.com',
    type: 'email',
}

export const IsDoneValidation = Template.bind({})

IsDoneValidation.args = {
    name: 'Name',
    defaultValue: 'Default value',
    type: 'text',
}

export const Number = Template.bind({})

Number.args = {
    name: 'Name',
    defaultValue: '42',
    type: 'number',
}
