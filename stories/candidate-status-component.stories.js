import React from 'react'
import CandidateStatusComponent from '../app/components/candidate-status-component'
import { SvgAccepted, SvgDeadlineMissed, SvgDeclined, SvgReminderSent } from '../app/components/lib/svg'

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

// todo consider moving to common function

export const TableArray = Template.bind({})
const tableArray = [
    [<SvgAccepted />, 1],
    [<SvgDeclined />, 2],
    [<SvgReminderSent />, 3],
    [<SvgDeadlineMissed />, 4],
]
TableArray.args = {
    tableArray,
}

export const StatusObj = Template.bind({})
const statusObj = { deadlineMissed: 4, videoSubmitted: 2, sent: 3, candidateCount: 10 }
StatusObj.args = {
    statusObj,
}

export const Empty = Template.bind({})
Empty.args = {
    tableArray: [],
}
