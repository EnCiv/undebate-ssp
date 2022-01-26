// https://github.com/EnCiv/undebate-ssp/issues/71
import React, { useEffect } from 'react'
import ObjectID from 'isomorphic-mongo-objectid'

export default function TestElectionDoc(props) {
    useEffect(() => {
        socket.emit('get-election-docs', docs => {
            console.log(docs)
        })

        const testDoc = {
            _id: ObjectID(),
            subject: 'Election Document',
            description: 'Election Document',
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
                invitations: [
                    // derived data, list may be empty or not present
                    { _id: ObjectID(), text: 'Hi Mike, please send answers', sentDate: 'date', acceptedDate: 'date' },
                ],
                submissions: [
                    // derived data, list may be empty or not present
                    { _id: ObjectID(), url: 'url', date: 'date' },
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
                            _id: ObjectID(),
                            text: 'text',
                            sentDate: 'date',
                            acceptedDate: 'date',
                        },
                    ],
                    submissions: [
                        // derived data - list may be empty or not present
                        { _id: ObjectID(), url: 'url', date: 'date' },
                    ],
                },
                '61e76bfc8a82733d08f0cf12': {
                    uniqueId: '61e76bfc8a82733d08f0cf12',
                    name: 'Michael Jefferson',
                    email: 'mikejeff@mail.com',
                    office: 'President of the U.S.',
                    region: 'United States',
                    invitations: [
                        {
                            _id: ObjectID(),
                            text: 'Hi Mike, please send answers',
                            sentDate: 'date',
                            acceptedDate: 'date',
                        },
                    ],
                    submissions: [
                        {
                            _id: ObjectID(),
                            url: 'date',
                            date: 'date',
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
            undebateDate: 'date',
        }
        socket.emit('upsert-election-doc', testDoc, ok => {
            console.log(ok)
        })
    }, [])
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>Hello World</div>
        </div>
    )
}
