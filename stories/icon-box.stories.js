// https://github.com/EnCiv/undebate-ssp/issues/113
import React from 'react'
import IconBox from '../app/components/icon-box'
import SvgFitsInside from '../app/svgr/fits-inside'

export default {
    title: 'Icon Box',
    component: IconBox,
}

const Template = args => (
    <div style={{ width: '25rem' }}>
        <IconBox {...args} />
    </div>
)

export const Default = Template.bind({})
Default.args = {}

export const TestOne = Template.bind({})
TestOne.args = {
    subject: 'Fits inside any layout, Embed anywhere!',
    description: 'Embeds available for multiple layouts. Delightful experience across a variety of devices. ',
    iconName: 'SvgFitsInside',
}

export const TestTwo = Template.bind({})
TestTwo.args = {
    subject: 'Automated and structured process.',
    description: 'Invites, reminders and scripts automated to ease the participation of all entities involved.',
    iconName: 'SvgAutomate',
}

export const TestThree = Template.bind({})
TestThree.args = {
    subject: 'Short formats to decide quickly.',
    description: 'Time conciousness at every step that caters more towards the modern attention span.',
    iconName: 'SvgShortFormat',
}
