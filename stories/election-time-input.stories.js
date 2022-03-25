// https://github.com/EnCiv/undebate-ssp/issues/6

import React, { useState } from 'react'
import ElectionTimeInput from '../app/components/election-time-input'

export default {
    title: 'Election Time Input',
    component: ElectionTimeInput,
}

const Template = (args, context) => {
    const { onDone } = context
    return (
        <div style={{ width: '50%' }}>
            <ElectionTimeInput onDone={onDone} {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    defaultValue: '',
}

export const DefaultValueSet = Template.bind({})
DefaultValueSet.args = {
    defaultValue: '12:00',
}

export const StyleOverride = Template.bind({})
StyleOverride.args = {
    style: {
        background: 'white',
        borderStyle: 'solid',
    },
}

const ValidationTemplate = args => {
    const [doneState, setDoneState] = useState({ valid: false, value: '' })
    return (
        <div style={{ width: '50%' }}>
            <ElectionTimeInput onDone={done => setDoneState(done)} {...args} />
            <div
                style={{
                    margin: '10px',
                }}
            >
                Is valid time: {`${doneState.valid}`}
            </div>
            <div
                style={{
                    margin: '10px',
                }}
            >
                Time: {`${doneState.value}`}
            </div>
        </div>
    )
}

export const TimeValidation = ValidationTemplate.bind({})
TimeValidation.args = {
    defaultValue: '12:00',
}
