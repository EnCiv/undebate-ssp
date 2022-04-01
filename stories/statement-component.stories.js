import React from 'react'
import StatementComponent from '../app/components/statement-component'
import { createUseStyles } from 'react-jss'

export default {
    title: 'StatementComponent',
    component: StatementComponent,
    argTypes: {},
}

const Template = args => <StatementComponent {...args} />

export const StatementComponentTest = Template.bind({})
StatementComponentTest.args = {
    subject: 'How it Works',
    description:
        'Dolor adipiscing augue diam nulla ornare dictum tortor id ut. Eu etiam sed fermentum egestas nisl nulla porttitor non justo. Dolor commodo id justo, pretium. Magna et arcu fringilla in nisi, mauris tincidunt. Penatibus turpis eget sapien non at phasellus lacus. Pellentesque consectetur nunc mi amet curabitur cras fames amet cursus.',
}
