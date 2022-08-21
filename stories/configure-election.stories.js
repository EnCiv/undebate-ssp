// https://github.com/EnCiv/undebate-ssp/issues/23
import iotas from '../iotas.json'
import component from '../app/components/configure-election'
import makeChapter from './make-chapter'
import ReactRouterDecorator from './react-router-decorator'

const mC = makeChapter(component)

export default {
    title: 'Configure Election',
    component,
    argTypes: {},
    decorators: [ReactRouterDecorator],
}

export const Default = mC({})

const defaultIota = iotas.filter(iota => iota.subject === 'Undebate SSP Test Iota')[0]
const defaultElectionObj = defaultIota.webComponent
defaultElectionObj.id = defaultIota._id.$oid || defaultIota._id

export const WithData = mC({ defaultElectionObj, user: { id: '6274ae8bee422b0f9c607b75', email: 'someone@email.com' } })

export const MoreData = mC({
    defaultElectionObj: {
        organizationName: 'United States Federal Government',
        organizationUrl: 'https://us.gov',
        organizationLogo: '',
        electionName: 'US General Election',
        email: 'whitehouse@us.gov',
        doneLocked: {
            Election: {
                done: '2022-08-08T23:29:53.030Z',
            },
            Timeline: {
                done: '2022-08-08T23:30:30.355Z',
            },
            Questions: {
                done: '2022-08-08T23:30:41.409Z',
            },
            Contact: {
                done: '2022-08-08T23:31:01.005Z',
            },
            Script: {
                done: '2022-08-08T23:31:06.430Z',
            },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: '2024-01-02T07:59:00.000Z',
                },
            },
            candidateSubmissionDeadline: {
                0: {
                    date: '2024-02-02T07:59:00.000Z',
                },
            },
        },
        undebateDate: '2024-03-02T07:59:00.000Z',
        electionDate: '2024-04-02T06:59:00.000Z',
        questions: {
            0: {
                text: 'Why do it?',
                time: '10',
            },
        },
        moderator: {
            name: 'Mr. Bill',
            email: 'mbill@us.gov',
            recorders: {
                '62d5fc793d4af57ff9a9f4af': {
                    _id: '62d5fc793d4af57ff9a9f4af',
                    path: '/country:us/org:usfg/office:moderator/2022-11-08-62d5fc793d4af57ff9a9f4af',
                },
            },
            viewers: {
                '62f19cc1a003a20134000011': {
                    _id: '62f19cc1a003a20134000011',
                    path: '/country:us/org:usfg/office:moderator/2022-11-08',
                },
            },
            invitations: {
                '62e85b5b7d67bd62c48a2d61': {
                    _id: '62e85b5b7d67bd62c48a2d61',
                    sentDate: '2022-08-08T23:31:19.499Z',
                },
            },
            submissions: {
                '62f1a003ded6e219ecb0b350': {
                    _id: '62f1a003ded6e219ecb0b350',
                },
            },
        },
        script: {
            0: {
                text: 'Our first question is "Why do it?", ...',
            },
            1: {
                text: 'Consectetur adipiscing elit',
            },
        },
    },
})
