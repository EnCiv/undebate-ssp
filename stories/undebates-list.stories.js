import React, { useEffect } from 'react'
import UndebatesList from '../app/components/undebates-list'
import { cloneDeep } from 'lodash'

// todo various dates to test filtering, archived elections, all candidate options, all statuses

export default {
    title: 'Undebates List',
    component: UndebatesList,
    argTypes: {},
}

const Template = (args, context) => {
    const { onDone, electionOM } = context

    return (
        <div>
            <UndebatesList {...args} onDone={onDone} />
        </div>
    )
}

const defaultElectionObject = {
    id: '6199481498ac4e36c8a64753',
    electionName: 'U.S Presidential Election',
    organizationName: 'United States Federal Government',
    electionDate: '2023-11-07T23:59:59.999Z',
    questions: {
        0: {
            text: 'What is your favorite color?',
            time: '30',
        },
        1: {
            text: 'Do you have a pet?',
            time: '60',
        },
        2: {
            text: 'Should we try to fix income inequality?',
            time: '90',
        },
    },
    script: {
        0: {
            text: 'Welcome everyone. Our first question is: What is your favorite color?',
        },
        1: {
            text: 'Thank you. Our next Question is: Do you have a pet?',
        },
        2: {
            text: 'Great. And our last question is: Should we try to fix income inequality?',
        },
        3: {
            text: 'Thanks everyone for watching this!',
        },
    },
    moderator: {
        name: 'Bill Smith',
        email: 'billsmith@gmail.com',
        message: 'Please be a moderator',
        invitations: [
            {
                _id: '1',
                sentDate: '2022-01-07T22:09:32.952Z',
                responseDate: '2022-01-07T22:09:32.952Z',
                status: 'Accepted',
            },
        ],
        submissions: [{ _id: '', url: '', date: '' }],
    },
    candidates: {
        '61e76bbefeaa4a25840d85d0': {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: [
                {
                    _id: '',
                    sentDate: '2022-01-07T22:09:32.952Z',
                    responseDate: '2022-01-07T22:09:32.952Z',
                    status: 'Declined',
                    parentId: '',
                },
            ],
        },
    },
    timeline: {
        moderatorDeadlineReminderEmails: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
            1: {
                date: '2022-01-07T22:09:32.952Z',
                sent: false,
            },
        },
        moderatorSubmissionDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
        },
        candidateDeadlineReminderEmails: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
            1: {
                date: '2022-01-07T22:09:32.952Z',
                sent: false,
            },
        },
        candidateSubmissionDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
        },
        moderatorInviteDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
            1: {
                date: '2022-01-07T22:09:32.952Z',
                sent: false,
            },
        },
    },
    undebateDate: '2022-01-07T22:09:32.952Z',
}

let moderatorElectionObject1 = cloneDeep(defaultElectionObject)
moderatorElectionObject1.id = '627e9dbd9ec85b0e440b6a3d'
moderatorElectionObject1.organizationName = 'San Diego Government Elections'
moderatorElectionObject1.electionName = 'SD County Supervisor'
moderatorElectionObject1.timeline.moderatorDeadlineReminderEmails[0].sent = false

let moderatorElectionObject2 = cloneDeep(defaultElectionObject)
moderatorElectionObject2.id = '627ecafe4c12b659a8b954de'
moderatorElectionObject2.organizationName = 'San Diego Government Elections'
moderatorElectionObject2.electionName = 'SD City Council'
moderatorElectionObject2.moderator.invitations[0].status = 'Declined'

let moderatorElectionObject3 = cloneDeep(defaultElectionObject)
moderatorElectionObject3.id = '62cb350e480f6535c1ec9b5e'
moderatorElectionObject3.organizationName = 'San Diego Government Elections'
moderatorElectionObject3.electionName = 'SD Mayor'
delete moderatorElectionObject3.script

let moderatorElectionObject4 = cloneDeep(defaultElectionObject)
moderatorElectionObject4.id = '62cb35fddc380a594cff7126'
moderatorElectionObject4.organizationName = 'Los Angeles Government Elections'
moderatorElectionObject4.electionName = 'LA Mayor'
delete moderatorElectionObject4.moderator.invitations[0].status

let moderatorElectionObject5 = cloneDeep(defaultElectionObject)
moderatorElectionObject5.id = '62cb365f384f59688794ae9c'
moderatorElectionObject5.organizationName = 'Los Angeles Government Elections'
moderatorElectionObject5.electionName = 'LA City Council'
moderatorElectionObject5.timeline.moderatorSubmissionDeadline[0].sent = false
moderatorElectionObject5.undebateDate = '2023-01-09T23:59:59.999Z'

let moderatorElectionObject6 = cloneDeep(defaultElectionObject)
moderatorElectionObject6.id = '62cb365f86a78c68bbaacc52'
moderatorElectionObject6.organizationName = 'Los Angeles Government Elections'
moderatorElectionObject6.electionName = 'LA County Supervisor'
moderatorElectionObject6.moderator.submissions[0].url = 'not null'
moderatorElectionObject6.electionDate = '2021-10-09T23:59:59.999Z'

let moderatorElectionObject7 = cloneDeep(defaultElectionObject)
moderatorElectionObject7.id = '62cb365f86a78c68bbaacc52'
moderatorElectionObject7.organizationName = 'Sacramento Government Elections'
moderatorElectionObject7.electionName = 'Sacramento County Supervisor'
moderatorElectionObject7.timeline.moderatorDeadlineReminderEmails[0].date = ''
moderatorElectionObject7.timeline.moderatorDeadlineReminderEmails[1].date = ''

export const AllModeratorOptions = Template.bind({})
AllModeratorOptions.args = {
    electionObjs: [
        defaultElectionObject, // Reminder sent
        moderatorElectionObject1, // Invite Accepted
        moderatorElectionObject2, // Invite Declined
        moderatorElectionObject3, // Script Pending
        moderatorElectionObject4, // Script Sent
        moderatorElectionObject5, // Deadline Missed
        moderatorElectionObject6, // Video Submitted
        moderatorElectionObject7, // dash/blank
    ],
}

let candidatesElectionObject1 = cloneDeep(defaultElectionObject)
candidatesElectionObject1.id = '627e9dbd9ec85b0e440b6a3d'
candidatesElectionObject1.organizationName = 'San Diego Government Elections'
candidatesElectionObject1.electionName = 'SD County Supervisor'
candidatesElectionObject1.timeline.moderatorDeadlineReminderEmails[0].date = ''
candidatesElectionObject1.timeline.moderatorDeadlineReminderEmails[1].date = ''

let candidatesElectionObject2 = cloneDeep(defaultElectionObject)
candidatesElectionObject2.id = '627ecafe4c12b659a8b954de'
candidatesElectionObject2.organizationName = 'San Diego Government Elections'
candidatesElectionObject2.electionName = 'SD City Council'
delete candidatesElectionObject2.candidates

let candidatesElectionObject3 = cloneDeep(defaultElectionObject)
candidatesElectionObject3.id = '62cb350e480f6535c1ec9b5e'
candidatesElectionObject3.organizationName = 'San Diego Government Elections'
candidatesElectionObject3.electionName = 'SD Mayor'
candidatesElectionObject3.moderator.invitations[0].sentDate = ''

let candidatesElectionObject4 = cloneDeep(defaultElectionObject)
candidatesElectionObject4.id = '62cb35fddc380a594cff7126'
candidatesElectionObject4.organizationName = 'Los Angeles Government Elections'
candidatesElectionObject4.electionName = 'LA Mayor'
const cand2 = {
    uniqueId: '62cbb1cf916df6cdbcfd8244',
    submissions: [
        {
            _id: '2',
            url: 'link1',
            date: '',
        },
    ],
}
const cand3 = {
    uniqueId: '62cbb1d07b8265ce0ee6f2e6',
    submissions: [
        {
            _id: '2',
            url: 'link2',
            date: '',
        },
    ],
}
candidatesElectionObject4.candidates[cand2.uniqueId] = cand2
candidatesElectionObject4.candidates[cand3.uniqueId] = cand3

export const AllCandidatesOptions = Template.bind({})
AllCandidatesOptions.args = {
    electionObjs: [
        defaultElectionObject,
        candidatesElectionObject1, // dash/blank
        candidatesElectionObject2, // Election Table Pending
        candidatesElectionObject3, // Invite Pending
        candidatesElectionObject4, // In Progress
        /* candidatesElectionObject5, // Ready */
    ],
}

export const Empty = Template.bind({})
Empty.args = { electionObjs: [] }
