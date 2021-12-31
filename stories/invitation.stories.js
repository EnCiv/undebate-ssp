/* eslint-disable no-unused-vars */
// https://github.com/EnCiv/undebate-ssp/issues/50

import React from 'react'

import { Invitation } from '../app/components/invitation'

export default {
    title: 'Invitation',
    component: Invitation,
    argTypes: {},
}

const Template = args => <Invitation {...args} />

export const InvitationTest = Template.bind({})
InvitationTest.args = {
    electionOM: {
        electionObj: { _id: '123', moderator: { name: '', email: '' } },
        electionMethods: { upsert: obj => {}, sendInvitation: inv => {} },
    },
}

export const WithData = Template.bind({})
WithData.args = {
    electionOM: {
        electionObj: { _id: '2349099238402', moderator: { name: 'James Smith', email: 'jsmith@gmail.com' } },
        electionMethods: { upsert: obj => {}, sendInvitation: inv => {} },
    },
}
