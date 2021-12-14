import LogoutButton from "../app/components/logout-button"

export default {
    title: "Logout Button",
    component: LogoutButton,
}

const Template = args => <LogoutButton {...args} />

export const Default = Template.bind({})
Default.args = {}
