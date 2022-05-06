// https://github.com/EnCiv/undebate-ssp/issues/20
import iotas from '../iotas.json'
import component from '../app/components/undebate-homepage'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Undebate Homepage',
    component,
    argTypes: {},
}

export const Default = mC({})

const defaultElectionObj = iotas.filter(iota => iota.subject === 'Undebate SSP Test Iota')[0].webComponent

export const WithData = mC({ defaultElectionObj })
