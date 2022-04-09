// https://github.com/EnCiv/undebate-ssp/issues/18
import UnitUnderTest from '../app/components/election-header'
import makeChapter from './make-chapter'
const mC = makeChapter(UnitUnderTest)

export default {
    title: 'Election Header',
    component: UnitUnderTest,
}

export const Normal = mC({
    defaultValue: 2,
    elections: ['District Attorney Election 1', 'District Attorney Election 2', 'District Attorney Election 3'],
})

export const Different = mC({
    defaultValue: 0,
    elections: ['President', 'Vice President', 'King'],
})
