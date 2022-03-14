// https://github.com/EnCiv/undebate-ssp/issues/113
import React from 'react'
import IconBox from '../app/components/icon-box'

export default {
    title: 'Icon Box',
    component: IconBox,
}

const Template = args => <IconBox {...args} />

export const Default = Template.bind({})
Default.args = {}

export const ScaledUp = Template.bind({})
ScaledUp.args = {
    style: {
        width: '50%',
        height: '50%',
    },
}

export const Background = Template.bind({})
Background.args = {
    style: {
        background: 'lightgrey',
    },
}
