// https://github.com/EnCiv/undebate-ssp/issues/44

import React from 'react'
import { ElectionComponent } from '../app/components/election-component'

export default {
    title: 'Election Component',
    component: ElectionComponent,
    argTypes: {},
}

const Template = args => <ElectionComponent {...args} />

export const ElectionComponentTest = Template.bind({})
ElectionComponentTest.args = {}
