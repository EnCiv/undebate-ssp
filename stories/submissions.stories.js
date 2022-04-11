// https://github.com/EnCiv/undebate-ssp/issues/56

import UnitUnderTest from '../app/components/submissions'
import makeChapter from './make-chapter'
const mC = makeChapter(UnitUnderTest)
export default {
    title: 'Submissions',
    component: UnitUnderTest,
    argTypes: {},
}

const today = new Date()

export const Default = mC({
    defaultElectionObj: {
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
                        sentDate: today,
                        responseDate: today,
                        status: 'Declined',
                        parentId: '',
                    },
                ],
                submissions: [
                    // derived data - list may be empty or not present
                    { _id: '', url: '', date: '', parentId: '' },
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
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'Accepted',
                    },
                ],
                submissions: [],
            },
            fddsfsd: {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: [
                    {
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                    },
                ],
                submissions: [
                    {
                        url: '',
                        date: '',
                    },
                ],
            },
            tessfd: {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: [
                    {
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'sent',
                    },
                ],
                submissions: [],
            },
            fdsfds: {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: [
                    {
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'Accepted',
                    },
                ],
            },
            abc: {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: [
                    {
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'Text Status',
                    },
                ],
                submissions: [],
            },
            fdsgfdsgfdg: {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'Senator',
                region: 'United States',
                invitations: [
                    {
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'Declined',
                    },
                ],
                submissions: [],
            },
            test: {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'Senator',
                region: 'United States',
                invitations: [
                    {
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'declined',
                    },
                ],
                submissions: [],
            },
        },
        timeline: {
            candidateSubmissionDeadline: {
                0: {
                    date: '2022-08-07T22:09:32.952Z',
                    sent: true,
                },
            },
        },
    },
})

export const DeadlineMissed = mC({
    defaultElectionObj: {
        ...Default.args.defaultElectionObj,
        timeline: { candidateSubmissionDeadline: { 0: { date: '2022-01-07T22:09:32.952Z', sent: true } } },
    },
})

export const Empty = mC({})
