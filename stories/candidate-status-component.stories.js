import React from 'react'
import CandidateStatusComponent from '../app/components/candidate-status-component'

export default {
    title: 'Candidate Status Component',
    component: CandidateStatusComponent,
    argTypes: {},
}

const Template = (args, context) => {
    return (
        <div>
            <CandidateStatusComponent {...args} />
        </div>
    )
}

export const StatusObj = Template.bind({})
let statusObj = { deadlineMissed: 4, videoSubmitted: 2, sent: 3, candidateCount: 10 }
StatusObj.args = {
    statusObj,
}

export const CandidatesCompleted = Template.bind({})
statusObj = { deadlineMissed: 0, videoSubmitted: 10, sent: 10, candidateCount: 10 }
CandidatesCompleted.args = {
    statusObj,
}

export const Empty = Template.bind({})
Empty.args = {
    tableArray: [],
}
