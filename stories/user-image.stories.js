import UserImage from '../app/components/user-image'

export default {
    title: 'User Image',
    component: UserImage,
}

const Template = args => <UserImage {...args} />

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
