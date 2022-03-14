// https://github.com/EnCiv/undebate-ssp/issues/113
import React from 'react'
import IconBox from '../app/components/icon-box'
import SvgFitsInside from '../app/svgr/fits-inside'

export default {
    title: 'Icon Box',
    component: IconBox,
}

const Template = args => <IconBox {...args} />

export const Default = Template.bind({})
Default.args = {}

export const TestOne = Template.bind({})
TestOne.args = {
    subject: 'Test One',
    description: 'Just one Test',
    iconName: 'SvgFitsInside',
}

export const Background = Template.bind({})
Background.args = {
    style: {
        background: 'lightgrey',
    },
}
