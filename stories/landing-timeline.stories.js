import React from 'react'
import LandingTimeline from '../app/components/landing-timeline'

export default {
    title: 'Landing Timeline',
    component: LandingTimeline,
}

const Template = args => <LandingTimeline {...args} />

export const Default = Template.bind({})
Default.args = {}
