import React, { useState } from 'react'
import TimelinePoint from '../app/components/timeline-point'

export default {
    title: 'Timeline Point',
    component: TimelinePoint,
}

const Template = args => {
    const [doneState, setDoneState] = useState({ valid: false, value: [] })
    return (
        <div>
            <div style={{ width: '50%' }}>
                <TimelinePoint onDone={done => setDoneState(done)} {...args} />
            </div>
            <div style={{ margin: '10px' }}>Is valid: {`${doneState.valid}`}</div>
            <div style={{ margin: '10px' }}>
                {doneState.value.map(dateTime => {
                    return (
                        <div>
                            Date: {dateTime.value.date} Time: {dateTime.value.time}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 dats and 7 days before the deadline.',
    dateTimes: [
        { date: '', time: '' },
        { date: '', time: '' },
    ],
}

export const Filled = Template.bind({})
Filled.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 dats and 7 days before the deadline.',
    dateTimes: [
        { date: '11/26/21', time: '14:00' },
        { date: '11/26/21', time: '14:00' },
        { date: '11/27/21', time: '02:00' },
    ],
}
