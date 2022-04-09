// https://github.com/EnCiv/undebate-ssp/issues/49

import makeChapter from './make-chapter'

// do not change UnitUnderTest, do change the name of the file to import from to be tested. It must export default the function
import UnitUnderTest from '../app/components/script'

const mC = makeChapter(UnitUnderTest)

export default {
    title: 'Script Page', // name that shows up in left column list of stories
    component: UnitUnderTest, // do not change
    argTypes: { electionOM: { type: 'object' } }, // change as appropriate
}

// exported is the name of the chapter of testing under the story
export const Default = mC({
    defaultElectionObj: {
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
        script: {},
        moderator: { name: 'Bill Smith' },
    },
})

export const Empty = mC({})

export const Locked = mC({
    defaultElectionObj: Default.args.defaultElectionObj,
    customMethods: { areQuestionsLocked: () => true },
})

export const Edit = mC({
    defaultElectionObj: { ...Default.args.defaultElectionObj, script: { 0: { text: 'Lorem Ipsum Dolor Amet' } } },
})

export const GivenQA = mC({
    defaultElectionObj: {
        ...Default.args.defaultElectionObj,
        questions: {
            0: { text: 'Lorem Ipsum?' },
            1: { text: 'Dolor Amet?' },
        },
        script: {
            0: { text: 'Lorem Ipsum Dolor Amet' },
            1: { text: 'Lorem Ipsum Dolor Amet' },
            2: { text: 'Consectetur adipiscing elit' },
            3: { text: 'Sed do eiusmod tempor' },
        },
    },
})

export const Error = mC({
    defaultElectionObj: {
        ...Default.args.defaultElectionObj,
        script: {
            0: { text: 'Lorem Ipsum Dolor Amet '.repeat(160) },
        },
    },
})
