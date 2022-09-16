// https://github.com/EnCiv/undebate-ssp/issues/20
import React, { useState, useEffect } from 'react'
import UndebateHomepage from '../app/components/undebate-homepage'
import { cloneDeep } from 'lodash'
import iotas from '../iotas.json'
import ReactRouterDecorator from './react-router-decorator'

export default {
    title: 'Undebate Homepage',
    component: UndebateHomepage,
    argTypes: {},
    decorators: [ReactRouterDecorator],
}
if (typeof logger === 'undefined') window.logger = console

const Template = (args, context) => {
    const { onDone, electionOM } = context
    useState(() => {
        // just want to do this when the Template is first called. useEffect is too late.
        window.socket = {
            emit: (handle, ...otherArgs) => {
                if (handle === 'create-election-doc') {
                    const [cb] = otherArgs
                    args.electionObjs.push({
                        id: '62a7c2f80c83204a784ee83c',
                        webComponent: 'ElectionDoc',
                    })
                    cb('62a7c2f80c83204a784ee83c')
                    return
                } else if (handle === 'get-election-docs') {
                    const [cb] = otherArgs
                    cb(args.electionObjs)
                    return
                } else if (handle === 'subscribe-election-info') {
                    const [id, cb] = otherArgs
                    cb(args.electionObjs.find(doc => doc.id === id))
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
    return <UndebateHomepage {...args} onDone={onDone} />
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

let defaultElectionObject2 = cloneDeep(defaultElectionObject)
defaultElectionObject2.id = '627ecafe4c12b659a8b954de'
defaultElectionObject2.organizationName = 'San Diego Government Elections'
defaultElectionObject2.electionName = 'SD City Council'

let defaultElectionObject3 = cloneDeep(defaultElectionObject)
defaultElectionObject3.id = '627ecafe4c12b659a8b954de'
defaultElectionObject3.organizationName = 'San Diego Government Elections'
defaultElectionObject3.electionName = 'SD City Council'

export const WithData = Template.bind({})
WithData.args = {
    electionObjs: [defaultElectionObject, defaultElectionObject1, defaultElectionObject2],
    user: { id: '6274ae8bee422b0f9c607b75', email: 'someone@email.com' },
}
export const Empty = Template.bind({})
export const NewUser = Template.bind({})
NewUser.args = {
    electionObjs: [],
    user: { id: '6274ae8bee422b0f9c607b75', email: 'someone@email.com' },
}
export const NoUser = Template.bind({})
const iota = iotas.find(doc => doc.path === '/undebates')
NoUser.args = iota.webComponent

export const NoDataYet = Template.bind()
NoDataYet.args = {
    user: { id: '6274ae8bee422b0f9c607b75', email: 'someone@email.com' },
}
