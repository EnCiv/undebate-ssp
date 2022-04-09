// https://github.com/EnCiv/undebate-ssp/issues/13
import React from 'react'
import VerticalTimeline from '../app/components/vertical-timeline'

export default {
    title: 'Vertical Timeline',
    component: VerticalTimeline,
    argTypes: {},
}

const Template = (args, context) => {
    return <VerticalTimeline {...args} />
}

export const Default = Template.bind({})

Default.args = {}
