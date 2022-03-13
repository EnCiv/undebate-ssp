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

const moderatorDeadlineReminderEmails = {
    0: {
        date: '2022-01-07T22:09:32.952Z',
        sent: true,
    },
    1: {
        date: '2022-01-07T22:09:32.952Z',
        sent: false,
    },
}

export const Filled = Template.bind({})
Filled.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    timelineObj: moderatorDeadlineReminderEmails,
    timelineKey: 'moderatorDeadlineReminderEmails',
    electionOM,
    addOne: true,
}

/* export const Empty = Template.bind({})
Filled.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    timelineObj: {},
    timelineKey: 'moderatorDeadlineReminderEmails',
    electionOM,
}

export const PartiallyFilled = Template.bind({})
PartiallyFilled.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    timelineObj: { ...moderatorDeadlineReminderEmails, 2: { date: '' } },
    timelineKey: 'moderatorDeadlineReminderEmails',
    electionOM,
} */
