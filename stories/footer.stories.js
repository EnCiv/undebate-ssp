//https://github.com/EnCiv/undebate-ssp/issues/110
import React from 'react'
import Footer from '../app/components/footer'

export default {
    title: 'Footer',
    component: Footer,
    argTypes: {},
}

const Template = args => (
    <div>
        <div style={{ height: '150vh', backgroundColor: '#f1dbff' }}></div>
        <Footer {...args} />
    </div>
)

export const FooterTest = Template.bind({})
FooterTest.args = {}
