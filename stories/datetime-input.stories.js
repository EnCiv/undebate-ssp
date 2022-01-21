import React from 'react'
import DateTimeInput from '../app/components/datetime-input'

export default {
    title: 'Datetime Input',
    component: DateTimeInput,
}

const Template = args => (
    <div style={{ width: '50%' }}>
        <DateTimeInput {...args} />
    </div>
)

export const Default = Template.bind({})
Default.args = {
    dateTime: { date: '', time: '' },
}

export const Filled = Template.bind({})
Filled.args = {
    dateTime: { date: '11/26/21', time: '14:00' },
}
