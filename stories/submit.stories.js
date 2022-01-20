// https://github.com/EnCiv/undebate-ssp/issues/14
import React from 'react'
import Submit from '../app/components/submit'

export default {
    title: 'Submit',
    component: Submit,
    argTypes: {},
}

const Template = (args, context) => {
    const { onDone } = context
    return <Submit onDone={onDone} {...args} />
}

export const SubmitDisabledAfterClick = Template.bind({})
SubmitDisabledAfterClick.args = {
    name: 'Submit',
    disabled: false,
    disableOnClick: true,
}

export const SubmitDisabled = Template.bind({})
SubmitDisabled.args = {
    name: 'Submit',
    disabled: true,
    disableOnClick: false,
}

export const SubmitNeverDisabled = Template.bind({})
SubmitNeverDisabled.args = {
    name: 'Submit',
    disabled: false,
    disableOnClick: false,
}
