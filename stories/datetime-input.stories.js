import React, { useState } from 'react'
import DateTimeInput from '../app/components/datetime-input'

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
