import React from 'react'
import StatementComponent from '../app/components/statement-component'

export default {
    title: 'StatementComponent',
    component: StatementComponent,
    argTypes: {},
}

const Template = args => <StatementComponent {...args} />

export const StatementComponentTest = Template.bind({})
StatementComponentTest.args = {}
