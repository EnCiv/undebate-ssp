// https://github.com/EnCiv/undebate-ssp/issues/56

import component from '../app/components/submissions'
import makeChapter from './make-chapter'
const mC = makeChapter(component)
export default {
    title: 'Submissions',
    component,
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
                invitations: {
                    // derived data - list may be empty or not present
                    '62e4c1fba25ed33a7006c072': {
                        _id: '62e4c1fba25ed33a7006c072',
                        sentDate: today,
                    },
                },
                submissions: {
                    // derived data - list may be empty or not present
                    '62e4c236d6654d501cae3bd1': { _id: '62e4c236d6654d501cae3bd1' },
                },
            },
            '61e76bfc8a82733d08f0cf12': {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: {
                    '62e4c28d672b781a8c464852': {
                        _id: '62e4c28d672b781a8c464852',
                        sentDate: today,
                    },
                },
            },
            '62e4c3965610d86b80a47e39': {
                uniqueId: '62e4c3965610d86b80a47e39',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: {
                    '62e4c3b84584224ae4d795a3': {
                        _id: '62e4c3b84584224ae4d795a3',
                        sentDate: today,
                    },
                },
                submissions: {
                    '62e4c3e9729f1d153096adc2': {
                        _id: '62e4c3e9729f1d153096adc2',
                    },
                },
            },
            '62e5832d50f99b2b3c8bdc35': {
                uniqueId: '62e5832d50f99b2b3c8bdc35',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: {
                    '62e5834f86c6f92f307d502b': {
                        _id: '62e5834f86c6f92f307d502b',
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'sent',
                    },
                },
                submissions: {},
            },
            '62e5837ba14bf1283c354f57': {
                uniqueId: '62e5837ba14bf1283c354f57',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: {
                    '62e5838fc301133aec036741': {
                        _id: '62e5838fc301133aec036741',
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'Accepted',
                    },
                },
            },
            '62e583d25fc5031c246211a9': {
                uniqueId: '62e583d25fc5031c246211a9',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'President of the U.S.',
                region: 'United States',
                invitations: {
                    '62e583f2b160d1409435fae3': {
                        _id: '62e583f2b160d1409435fae3',
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'Text Status',
                    },
                },
                submissions: {},
            },
            '62e5841a1203202a78def128': {
                uniqueId: '62e5841a1203202a78def128',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'Senator',
                region: 'United States',
                invitations: {
                    '62e5842d551e684924df9c27': {
                        _id: '62e5842d551e684924df9c27',
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'Declined',
                    },
                },
                submissions: [],
            },
            '62e5845622b9fa2598018779': {
                uniqueId: '62e5845622b9fa2598018779',
                name: 'Michael Jefferson',
                email: 'mikejeff@mail.com',
                office: 'Senator',
                region: 'United States',
                invitations: {
                    '62e5846908d99d3f8407a5eb': {
                        _id: '62e5846908d99d3f8407a5eb',
                        text: 'Hi Mike, please send answers',
                        sentDate: today,
                        responseDate: today,
                        status: 'declined',
                    },
                },
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
