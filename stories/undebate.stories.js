// https://github.com/EnCiv/undebate-ssp/issue/57

import component from '../app/components/undebate'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Undebate',
    component,
    argTypes: {},
}

export const Default = mC({
    defaultElectionObj: {
        electionName: 'The Presidential Election',
        offices: {
            President: {
                viewers: {
                    '62e4b5dd56f1ca6584d8bce4': {
                        _id: '62e4b5dd56f1ca6584d8bce4',
                        path: '/candidate-conversation-5',
                    },
                },
            },
        },
    },
})

export const Empty = mC({})

export const NoOffice = mC({
    defaultElectionObj: {
        electionName: 'The Presidential Election',
        offices: {},
    },
})

export const NoPresident = mC({
    defaultElectionObj: {
        electionName: 'The Presidential Election',
        offices: {
            President: {},
        },
    },
})
