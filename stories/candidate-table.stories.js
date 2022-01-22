// https://github.com/EnCiv/undebate-ssp/issues/88

import React, { useEffect } from 'react'
import CandidateTable from '../app/components/candidate-table'

export default {
    title: 'Candidate Table',
    component: CandidateTable,
}

const Template = (args, context) => {
    const { onDone, electionOM } = context
    const { defaultValue, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert(defaultValue), [defaultValue])

    return <CandidateTable electionOM={electionOM} {...otherArgs} onDone={onDone} />
}

export const Default = Template.bind({})
Default.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates: {
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
    },
}

export const Empty = Template.bind({})
Empty.args = { name: 'Candidate Table' }
