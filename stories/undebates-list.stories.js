import React, { useEffect } from 'react'
import UndebatesList from '../app/components/undebates-list'
import { cloneDeep } from 'lodash'

// todo various dates, archived elections, all candidate options, all statuses

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
            // derived data, list may be empty or not present
            {
                _id: '123',
                sentDate: '2022-01-07T22:09:32.952Z',
                responseDate: '2022-01-07T22:09:32.952Z',
                status: 'Accepted',
            },
        ],
        submissions: [
            // derived data, list may be empty or not present
            { _id: '', url: '', date: '' },
        ],
    },
    candidates: {
        '61e76bbefeaa4a25840d85d0': {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: [
                // derived data - list may be empty or not present
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
let defaultElectionObject1 = cloneDeep(defaultElectionObject)
defaultElectionObject1.id = '627e9dbd9ec85b0e440b6a3d'
defaultElectionObject1.organizationName = 'San Diego Government Elections'
defaultElectionObject1.electionName = 'SD County Supervisor'
defaultElectionObject1.timeline.moderatorDeadlineReminderEmails[0].sent = false

let defaultElectionObject2 = cloneDeep(defaultElectionObject)
defaultElectionObject2.id = '627ecafe4c12b659a8b954de'
defaultElectionObject2.organizationName = 'San Diego Government Elections'
defaultElectionObject2.electionName = 'SD City Council'
defaultElectionObject2.moderator.invitations[0].status = 'Declined'

let defaultElectionObject3 = cloneDeep(defaultElectionObject)
defaultElectionObject3.id = '62cb350e480f6535c1ec9b5e'
defaultElectionObject3.organizationName = 'San Diego Government Elections'
defaultElectionObject3.electionName = 'SD Mayor'
delete defaultElectionObject3.script

let defaultElectionObject4 = cloneDeep(defaultElectionObject)
defaultElectionObject4.id = '62cb35fddc380a594cff7126'
defaultElectionObject4.organizationName = 'Los Angeles Government Elections'
defaultElectionObject4.electionName = 'LA Mayor'
delete defaultElectionObject4.moderator.invitations[0].status

let defaultElectionObject5 = cloneDeep(defaultElectionObject)
defaultElectionObject5.id = '62cb365f384f59688794ae9c'
defaultElectionObject5.organizationName = 'Los Angeles Government Elections'
defaultElectionObject5.electionName = 'LA City Council'
defaultElectionObject5.timeline.moderatorSubmissionDeadline[0].sent = false
defaultElectionObject5.undebateDate = new Date('2023-01-09T23:59:59.999Z')

let defaultElectionObject6 = cloneDeep(defaultElectionObject)
defaultElectionObject6.id = '62cb365f86a78c68bbaacc52'
defaultElectionObject6.organizationName = 'Los Angeles Government Elections'
defaultElectionObject6.electionName = 'LA County Supervisor'
defaultElectionObject6.moderator.submissions[0].url = 'not null'
defaultElectionObject6.electionDate = new Date('2022-07-09T23:59:59.999Z')

// todo add null electionDate for empty moderator option
export const AllModeratorOptions = Template.bind({})
AllModeratorOptions.args = {
    electionObjs: [
        defaultElectionObject, // Reminder sent
        defaultElectionObject1, // Invite Accepted
        defaultElectionObject2, // Invite Declined
        defaultElectionObject3, // Script Pending
        defaultElectionObject4, // Script Sent
        defaultElectionObject5, // Deadline Missed
        defaultElectionObject6, // Video Submitted
    ],
}

export const Empty = Template.bind({})
Empty.args = { electionObjs: [] }
