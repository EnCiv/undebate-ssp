import React from 'react'

import { createUseStyles } from 'react-jss'
import ElectionCategory from '../app/components/election-category.js'

// from issue: https://github.com/EnCiv/undebate-ssp/issues/5

export default {
    title: 'Election Category',
    component: ElectionCategory,
}

const useStyles = createUseStyles({
    category: { width: '20rem', backgroundColor: '#d4d5d6' },
})

const Template = args => <ElectionCategory className={useStyles().category} categoryName="Testing" {...args} />

export const Default = Template.bind({})
Default.args = {}

export const InProgress = Template.bind({})
InProgress.args = {
    // could instead be [{completed: true}, {percentComplete: 90}]
    statusObjs: ['completed', { percentComplete: 90 }],
}

export const DaysLeft = Template.bind({})
DaysLeft.args = {
    statusObjs: [{ daysLeft: 9 }],
}

export const TextWithIcon = Template.bind({})
TextWithIcon.args = {
    statusObjs: 'videoSubmitted', // Equal to [{videoSubmitted: true}]
}

export const WithTable = Template.bind({})
WithTable.args = {
    statusObjs: [{ accepted: 29 }, { declined: 2 }, { reminderSent: 2 }, { deadlineMissed: 1 }],
}

export const Pending = Template.bind({})
Pending.args = {
    statusObjs: [{ pending: true }],
}

export const InvitationSent = Template.bind({})
InvitationSent.args = {
    statusObjs: [{ sent: true }],
}

export const InvitationAccepted = Template.bind({})
InvitationAccepted.args = {
    statusObjs: [{ accepted: true }],
}

export const InvitationDeclined = Template.bind({})
InvitationDeclined.args = {
    statusObjs: [{ declined: true }],
}

export const ReminderSent = Template.bind({})
ReminderSent.args = {
    statusObjs: [{ reminderSent: true }],
}

export const DeadlineMissed = Template.bind({})
DeadlineMissed.args = {
    statusObjs: [{ deadlineMissed: true }],
}

export const ArbritraryText = Template.bind({})
ArbritraryText.args = {
    statusObjs: [{ Testing: true }],
}
