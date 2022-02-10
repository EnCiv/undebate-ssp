// https://github.com/EnCiv/undebate-ssp/issues/12

import React from 'react'
import TimelinePoint from '../app/components/timeline-point'

export default {
    title: 'Timeline Point',
    component: TimelinePoint,
}

const Template = (args, context) => {
    const { onDone } = context
    return (
        <div style={{ width: '50%' }}>
            <TimelinePoint onDone={onDone} {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    dateTimes: [
        { date: '', time: '' },
        { date: '', time: '' },
    ],
}

export const Filled = Template.bind({})
Filled.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    dateTimes: [
        { date: '11/26/25', time: '14:00' },
        { date: '11/26/21', time: '14:00' },
        { date: '11/27/21', time: '02:00' },
    ],
}
export const PartiallyFilled = Template.bind({})
PartiallyFilled.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    dateTimes: [
        { date: '11/26/25', time: '14:00' },
        { date: '', time: '' },
        { date: '11/27/21', time: '02:00' },
    ],
}
