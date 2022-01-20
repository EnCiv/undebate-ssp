/* eslint-disable no-unused-vars */
// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useEffect } from 'react'

import { Invitation } from '../app/components/invitation'

export default {
    title: 'Invitation',
    component: Invitation,
    argTypes: {},
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultElectionObj, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <Invitation electionOM={electionOM} {...otherArgs} />
}

export const InvitationTest = Template.bind({})
InvitationTest.args = {
    defaultElectionObj: { _id: '123', moderator: { name: '', email: '' } },
}

export const WithData = Template.bind({})
WithData.args = {
    defaultElectionObj: { _id: '2349099238402', moderator: { name: 'James Smith', email: 'jsmith@gmail.com' } },
}
