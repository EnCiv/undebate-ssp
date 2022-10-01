import React, { useEffect } from 'react'
import InviteMeter from '../app/components/invite-meter'

export default {
    title: 'Invite Meter',
    component: InviteMeter,
    argTypes: {},
}

const storyDefaultElectionObj = {
    _id: 'mongoobjid',
    electionName: 'U.S Presidential Election',
    organizationName: 'United States Federal Government',
    electionDate: '2022-11-07T23:59:59.999Z',
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
        invitations: {
            // derived data, list may be empty or not present
            '6337542e58cdbc6368ff620b': {
                _id: '6337542e58cdbc6368ff620b',
                sentDate: '2022-01-07T22:09:32.952Z',
                responseDate: '2022-01-07T22:09:32.952Z',
                status: 'Accepted',
            },
        },
        submissions: {
            '633754444641c73014d3760d':
                // derived data, list may be empty or not present
                { _id: '633754444641c73014d3760d', url: '', date: '' },
        },
    },
    candidates: {
        '61e76bbefeaa4a25840d85d0': {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: {
                // derived data - list may be empty or not present
                '63375479a29e5f388c43f4c8': {
                    _id: '63375479a29e5f388c43f4c8',
                    sentDate: '2022-01-07T22:09:32.952Z',
                    responseDate: '2022-01-07T22:09:32.952Z',
                    status: 'Accepted',
                    parentId: '',
                },
            },
        },
        test: {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: {
                '6337549a96d38d14f8aaf5b5':
                    // derived data - list may be empty or not present
                    {
                        _id: '6337549a96d38d14f8aaf5b5',
                        sentDate: '2022-01-07T22:09:32.952Z',
                        responseDate: '2022-01-07T22:09:32.952Z',
                        status: 'Declined',
                        parentId: '',
                    },
            },
        },
        lorem: {
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
                    status: 'Accepted',
                    parentId: '',
                },
            ],
        },
        ipsum: {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: {
                // derived data - list may be empty or not present
                '633754d799b6a62254124641': {
                    _id: '633754d799b6a62254124641',
                    sentDate: '2022-01-07T22:09:32.952Z',
                    responseDate: '2022-01-07T22:09:32.952Z',
                    status: 'Accepted',
                    parentId: '',
                },
            },
            submissions: {},
        },
        dolor: {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: {
                // derived data - list may be empty or not present
                '633754f59d64253b382b5d5c': {
                    _id: '633754f59d64253b382b5d5c',
                    sentDate: '2022-01-07T22:09:32.952Z',
                    responseDate: '2022-01-07T22:09:32.952Z',
                    status: 'Sent',
                    parentId: '',
                },
            },
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
                date: '2022-08-07T22:09:32.952Z',
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

const Template = (args, context) => {
    const { electionOM } = context
    const [electionObj, electionMethods] = electionOM
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    Object.assign(electionMethods, customMethods)

    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])

    return (
        <div>
            <InviteMeter electionOM={electionOM} {...otherArgs} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = { defaultElectionObj: storyDefaultElectionObj }

export const Empty = Template.bind({})
Empty.args = {}
