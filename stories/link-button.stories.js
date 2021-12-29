import LinkButton from '../app/components/link-button'

import InstructionSVG from '../app/svgr/home'

export default {
    title: 'Link Button',
    component: LinkButton,
}

const Template = args => <LinkButton {...args} />

export const Default = Template.bind({})
Default.args = {
    children: 'Default',
    href: '/default',
}

export const WithIcon = Template.bind({})
WithIcon.args = {
    style: { color: 'black', background: 'white', border: '1px solid' },
    children: ['Home', <InstructionSVG style={{ width: '1.25rem', color: 'white' }} />],
    href: '/home',
}
