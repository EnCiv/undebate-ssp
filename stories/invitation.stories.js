/* eslint-disable no-unused-vars */
// https://github.com/EnCiv/undebate-ssp/issues/50

// do not change 'component', do change the name of the file to import from to be tested. It must export default the function
import component from '../app/components/invitation'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Invitation',
    component,
    argTypes: {},
}

export const Empty = mC({})

export const InvitationTest = mC({
    defaultElectionObj: { id: '123', moderator: { name: '', email: '' } },
})

export const WithData = mC({
    defaultElectionObj: { id: '2349099238402', moderator: { name: 'James Smith', email: 'jsmith@gmail.com' } },
})
