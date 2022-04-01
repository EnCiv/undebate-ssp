import React from 'react'
import Undebates from '../app/components/undebates-landing-page'

export default {
    title: 'Undebates',
    component: Undebates,
    argTypes: {},
}

const Template = args => (
    <div>
        <Undebates {...args} />
    </div>
)

export const UndebatesTest = Template.bind({})
UndebatesTest.args = {}