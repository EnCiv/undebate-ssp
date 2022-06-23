// https://github.com/EnCiv/undebate-ssp/issues/120

import React from 'react'

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
WithData.args = {
    linkObj: {
        subject: 'Student Government Elections',
        url: 'https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07',
        subtitle: '13 Offices',
    },
    portraitStatement: {
        subject: 'Taylored for every device and every layout',
        description:
            'Dolor adipiscing augue diam nulla ornare dictum tortor id ut. Eu etiam sed fermentum egestas nisl nulla porttitor non justo. Dolor commodo id justo, pretium. Magna et arcu fringilla in nisi, mauris tincidunt. Penatibus turpis eget sapien non at phasellus lacus. Pellentesque consectetur nunc mi amet curabitur cras fames amet cursus.',
    },
}
