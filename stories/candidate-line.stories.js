import React from 'react'
import CandidateLine from '../app/components/candidate-line'

export default {
    title: 'Candidate Line',
    component: CandidateLine,
}

const Template = args => {
    return (
        <>
            <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap' rel='stylesheet' />
            <CandidateLine {...args} />
        </>
    )
}

export const Default = Template.bind({})
Default.args = {
    name: 'Arlene McCoy',
    office: 'Egestas facilisis',
    inviteStatus: 'accepted',
    submissionStatus: 'submitted',
    reminders: 'Do the thing',
}

export const DefaultDeclined = Template.bind({})
DefaultDeclined.args = {
    name: 'Arlene McCoy',
    office: 'Egestas facilisis',
    inviteStatus: 'declined',
    submissionStatus: 'submitted',
    reminders: 'Do the thing',
}

export const DefaultSent = Template.bind({})
DefaultSent.args = {
    name: 'Arlene McCoy',
    office: 'Egestas facilisis',
    inviteStatus: 'sent',
    submissionStatus: 'Video Submitted',
    reminders: 'Do the thing',
}

export const DefaultNoName = Template.bind({})
DefaultNoName.args = {
    office: 'Egestas facilisis',
    inviteStatus: 'accepted',
    submissionStatus: 'submitted',
    reminders: 'Do the thing',
}

export const DefaultNoOffice = Template.bind({})
DefaultNoOffice.args = {
    name: 'Arlene McCoy',
    inviteStatus: 'accepted',
    submissionStatus: 'submitted',
    reminders: 'Do the thing',
}

export const DefaultNoInvite = Template.bind({})
DefaultNoInvite.args = {
    name: 'Arlene McCoy',
    office: 'Egestas facilisis',
    submissionStatus: 'submitted',
    reminders: 'Do the thing',
}

export const DefaultNoSubmission = Template.bind({})
DefaultNoSubmission.args = {
    name: 'Arlene McCoy',
    office: 'Egestas facilisis',
    inviteStatus: 'accepted',
    reminders: 'Do the thing',
}

export const DefaultNoReminder = Template.bind({})
DefaultNoReminder.args = {
    name: 'Arlene McCoy',
    office: 'Egestas facilisis',
    inviteStatus: 'accepted',
    submissionStatus: 'Video Submitted',
}
