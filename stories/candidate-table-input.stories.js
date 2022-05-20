// https://github.com/EnCiv/undebate-ssp/issues/88

import React, { useEffect } from 'react'
import CandidateTableInput from '../app/components/candidate-table-input'

export default {
    title: 'Election Table Input',
    component: CandidateTableInput,
}

const Template = (args, context) => {
    const { onDone, electionOM } = context
    const { defaultValue, ...otherArgs } = args
    debugger
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert({ candidates: defaultValue }), [defaultValue])
    const candidateTable = Object.values(electionObj.candidates || {})
    const columns = [
        {
            Header: 'Candidate Name',
            accessor: 'name',
        },
        {
            Header: 'Email Address',
            accessor: 'email',
        },
        {
            Header: 'Office',
            accessor: 'office',
        },
        {
            Header: 'Region',
            accessor: 'region',
        },
        {
            Header: 'Invite Status',
            accessor: 'status',
        },
        /*  {
                Header: 'Unique Id',
                accessor: 'uniqueId',
            },*/
    ]

    return (
        <CandidateTableInput
            onDone={({ valid, value }) => valid && electionMethods.upsert({ candidates: { [value.uniqueId]: value } })}
            defaultValue={candidateTable}
            columnNames={columns}
            {...otherArgs}
        />
    )
}

export const Default = Template.bind({})
Default.args = {
    name: 'Candidate Table',
    defaultValue: {
        '61e34ba4dd28d45f2c6c66be': {
            name: 'Diana Russell',
            email: 'felicia.reid@example.com',
            office: 'Posuere sed',
            region: 'Fermentum massa',
            status: 'Send 12 days ago',
            uniqueId: '61e34ba4dd28d45f2c6c66be',
        },
        '61e34bb17ad05c2b9003f600': {
            name: 'Jacob Jones',
            email: 'nevaeh.simmons@example.com',
            office: 'Eu at',
            region: 'Amet sodales',
            status: 'Send 12 days ago',
            uniqueId: '61e34bb17ad05c2b9003f600',
        },
    },
    editable: true,
}

export const EmptyUnlocked = Template.bind({})
EmptyUnlocked.args = { name: 'Candidate Table', editable: true }

export const EmptyLocked = Template.bind({})
EmptyLocked.args = { name: 'Candidate Table' }

export const Locked = Template.bind({})
Locked.args = {
    name: 'Candidate Table',
    defaultValue: {
        '61e34ba4dd28d45f2c6c66be': {
            name: 'Diana Russell',
            email: 'felicia.reid@example.com',
            office: 'Posuere sed',
            region: 'Fermentum massa',
            status: 'Send 12 days ago',
            uniqueId: '61e34ba4dd28d45f2c6c66be',
        },
        '61e34bb17ad05c2b9003f600': {
            name: 'Jacob Jones',
            email: 'nevaeh.simmons@example.com',
            office: 'Eu at',
            region: 'Amet sodales',
            status: 'Send 12 days ago',
            uniqueId: '61e34bb17ad05c2b9003f600',
        },
    },
    editable: false,
}
