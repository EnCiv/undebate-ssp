// https://github.com/EnCiv/undebate-ssp/issues/20
import React, { useState, useEffect } from 'react'
import { expect } from '@storybook/jest'
import { within, userEvent, waitFor } from '@storybook/testing-library'
import SubscribeElectionInfo from '../app/components/subscribe-election-info'
import ReactRouterDecorator from './react-router-decorator'

export default {
    title: 'Subscribe Election Info',
    component: SubscribeElectionInfo,
    argTypes: {},
    decorators: [ReactRouterDecorator],
}

const Template = (args, context) => {
    const { onDone, electionOM } = context
    useState(() => {
        // just want to do this when the Template is first called. useEffect is too late.
        window.socket = {
            emit: (handle, ...otherArgs) => {
                if (handle === 'get-election-docs') {
                    const [cb] = otherArgs
                    cb(electionObjs)
                    return
                } else if (handle === 'subscribe-election-info') {
                    const [id, cb] = otherArgs
                    cb(electionObjs.find(doc => doc.id === id))
                    // subscriptions are not handled, just the initial result is returned
                    return
                } else if (handle === 'send-password') {
                    const [email, href, cb] = otherArgs
                    if (email === 'success@email.com') setTimeout(() => cb({ error: '' }), 1000)
                    else setTimeout(() => cb({ error: 'User not found' }), 1000)
                    return
                } else console.error('emit expected send-password, got:', handle)
            },
            // when user authenticates socket io needs to close and then connect to authenticate the user
            // so we simulate that here
            onHandlers: {},
            on: (handle, handler) => {
                window.socket.onHandlers[handle] = handler
            },
            close: () => {
                if (window.socket.onHandlers.connect) setTimeout(window.socket.onHandlers.connect, 1000)
                else console.error('No connect handler registered')
            },
            removeListener: () => {},
            leave: room => {
                delete window.socket.onHandlers[room]
            },
        }
    })
    return (
        <div>
            <SubscribeElectionInfo {...args} onDone={onDone} />
        </div>
    )
}
const electionObjs = [
    {
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
            invitations: {
                '6337603ae0c62042803b3be6':
                    // derived data, list may be empty or not present
                    {
                        _id: '6337603ae0c62042803b3be6',
                        sentDate: '2022-01-07T22:09:32.952Z',
                        responseDate: '2022-01-07T22:09:32.952Z',
                        status: 'Accepted',
                    },
            },
            submissions: {
                '63376053e3803658bc6e66f4':
                    // derived data, list may be empty or not present
                    { _id: '63376053e3803658bc6e66f4', url: '', date: '' },
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
                    '63376069d0713d6de83824ea':
                        // derived data - list may be empty or not present
                        {
                            _id: '63376069d0713d6de83824ea',
                            sentDate: '2022-01-07T22:09:32.952Z',
                            responseDate: '2022-01-07T22:09:32.952Z',
                            status: 'Declined',
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
    },
]

export const WithData = Template.bind({})
WithData.args = {
    id: '6199481498ac4e36c8a64753',
    key: '6199481498ac4e36c8a64753',
}
export const Empty = Template.bind({})
export const IdNotFound = Template.bind({})
IdNotFound.args = { id: '1', key: 1 }
export const AsyncUpdate = Template.bind({})
AsyncUpdate.args = {
    id: '6199481498ac4e36c8a64753',
    key: '6199481498ac4e36c8a64753',
}
AsyncUpdate.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))
    const electionName = '2024 U.S. Presidential Election'
    const electionNameEle = canvas.getByDisplayValue(electionObjs[0].electionName)
    window.socket.onHandlers['subscribe-election-info:6199481498ac4e36c8a64753']({
        electionName,
    })
    await waitFor(() => expect(electionNameEle.value).toMatch(electionName))
}
