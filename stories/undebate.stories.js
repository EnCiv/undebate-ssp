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
        undebate: {
            url: 'https://github.com',
        },
    },
})

export const Empty = mC({})

export const NoUrl = mC({
    defaultElectionObj: {
        undebate: {},
    },
})
