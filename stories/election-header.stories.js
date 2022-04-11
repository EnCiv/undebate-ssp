// https://github.com/EnCiv/undebate-ssp/issues/18

// do not change 'component' to any other name, just change the file being imported from
import component from '../app/components/election-header'
import makeChapter from './make-chapter'
const mC = makeChapter(component) // do not change
export default {
    title: 'Election Header', // This is the Story title that will be displayed in the left column list of stories
    component, // do not change
}

export const Normal = mC({
    defaultValue: 2,
    elections: ['District Attorney Election 1', 'District Attorney Election 2', 'District Attorney Election 3'],
})

export const Different = mC({
    defaultValue: 0,
    elections: ['President', 'Vice President', 'King'],
})
