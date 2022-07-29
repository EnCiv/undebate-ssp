import React from 'react'
import CandidateStatusTable from '../app/components/candidate-status-table'
import { SvgAccepted, SvgDeadlineMissed, SvgDeclined, SvgReminderSent } from '../app/components/lib/svg'

export default {
    title: 'Candidate Status Table',
    component: CandidateStatusTable,
    argTypes: {},
}

const Template = (args, context) => {
    return (
        <div>
            <CandidateStatusTable {...args} />
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
const statusObj = { accepted: 4, declined: 2, reminderSent: 3, deadlineMissed: 1 }
StatusObj.args = {
    statusObj,
}

export const Empty = Template.bind({})
Empty.args = {
    tableArray: [],
}
