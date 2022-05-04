// https://github.com/EnCiv/undebate-ssp/issues/12

import React, { useEffect } from 'react'
import TimelinePoint from '../app/components/timeline-point'

export default {
    title: 'Timeline Point',
    component: TimelinePoint,
}

const Template = (args, context) => {
    const { onDone, electionOM } = context
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return (
        <div style={{ width: '50%' }}>
            <TimelinePoint electionOM={electionOM} onDone={onDone} {...args} />
        </div>
    )
}

const moderatorDeadlineReminderEmails = {
    0: {
        date: '2022-01-07T22:09:00.000Z',
        sent: true,
    },
    1: {
        date: '2022-01-07T22:09:00.000Z',
        sent: false,
    },
}

export const Filled = Template.bind({})
Filled.args = {
    defaultElectionObj: { timeline: { moderatorDeadlineReminderEmails } },
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    timelineKey: 'moderatorDeadlineReminderEmails',
    addOne: true,
}

export const Empty = Template.bind({})
Empty.args = {
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    timelineKey: 'moderatorDeadlineReminderEmails',
    addOne: true,
}

export const PartiallyFilled = Template.bind({})
PartiallyFilled.args = {
    defaultElectionObj: { timeline: { moderatorDeadlineReminderEmails: {} } },
    title: 'Moderator Deadline Reminder Emails',
    description:
        'Moderator will recieve two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
    timelineKey: 'moderatorDeadlineReminderEmails',
}
