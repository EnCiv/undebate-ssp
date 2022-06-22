// https://github.com/EnCiv/undebate-ssp/issues/23
import iotas from '../iotas.json'
import component from '../app/components/configure-election'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Configure Election',
    component,
    argTypes: {},
}

export const Default = mC({})

const defaultElectionObj = iotas.filter(iota => iota.subject === 'Undebate SSP Test Iota')[0].webComponent

export const WithData = mC({ defaultElectionObj, user: { id: '6274ae8bee422b0f9c607b75', email: 'someone@email.com' } })
