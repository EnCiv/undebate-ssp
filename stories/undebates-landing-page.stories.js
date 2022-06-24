import React from 'react'
import Undebates from '../app/components/undebates-landing-page'
import iotas from '../iotas.json'

export default {
    title: 'Undebates Landing Page',
    component: Undebates,
    argTypes: {},
}

const Template = args => (
    <div>
        <Undebates {...args} />
    </div>
)

export const Empty = Template.bind({})

export const UndebatesTest = Template.bind({})
const iota = iotas.find(doc => doc.path === '/undebates-new')
UndebatesTest.args = iota.webComponent
