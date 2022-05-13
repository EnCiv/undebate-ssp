// https://github.com/EnCiv/undebate-ssp/issues/120

import React, { useState, useEffect } from 'react'

import LandscapePortraitSlider from '../app/components/landscape-portrait-slider'

export default {
    title: 'Landscape Portrait Slider',
    component: LandscapePortraitSlider,
    argTypes: {},
}

const Template = (args, context) => {
    return <LandscapePortraitSlider {...args} />
}

export const LandscapePortraitSliderTest = Template.bind({})
LandscapePortraitSlider.args = {}

export const WithData = Template.bind({})
WithData.args = {}
