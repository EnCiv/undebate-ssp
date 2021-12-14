import LinkButton from "../app/components/link-button"

export default {
    title: "Link Button",
    component: LinkButton,
}

const Template = args => <LinkButton {...args} />

export const Default = Template.bind({})
Default.args = {}
