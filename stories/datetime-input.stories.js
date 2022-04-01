import React, { useState, useEffect } from 'react'
import DateTimeInput from '../app/components/datetime-input'
import { createUseStyles } from 'react-jss'

export default {
    title: 'Datetime Input',
    component: DateTimeInput,
}

const Template = args => {
    const [doneState, setDoneState] = useState({ valid: false, value: { time: '', date: '' } })

    return (
        <div style={{ width: '50%' }}>
            <DateTimeInput onDone={done => setDoneState(done)} {...args} />
            <h3>OnDone Values:</h3>
            <div style={{ margin: '10px' }}>Is valid datetime: {`${doneState.valid}`}</div>
            <div style={{ margin: '10px' }}>Date: {`${doneState.value.date}`}</div>
            <div style={{ margin: '10px' }}>Time: {`${doneState.value.time}`}</div>
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    defaultValue: { date: '', time: '' },
}

export const Filled = Template.bind({})
Filled.args = {
    defaultValue: { date: '11/26/22', time: '14:00' },
}

export const Disabled = Template.bind({})
Disabled.args = {
    defaultValue: { date: '11/26/21', time: '14:00' },
}

const Template2 = (args, context) => {
    const { electionOM, onDone } = context
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return (
        <div style={{ width: '15rem' }}>
            <DateTimeInput
                {...args}
                defaultValue={electionObj.electionDateTimeStory}
                onDone={({ valid, value }) => {
                    console.log(value)
                    electionMethods.upsert({ electionDateTimeStory: value })
                    onDone({ valid, value })
                }}
            />
        </div>
    )
}

export const Default2 = Template2.bind({})
Default2.args = {}

export const WithDefaultValue2 = Template2.bind({})
WithDefaultValue2.args = {
    defaultElectionObj: {
        electionDateTimeStory: { date: '11/12/2022', time: '12:00 AM' },
    },
}
