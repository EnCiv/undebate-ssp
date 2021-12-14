// https://github.com/EnCiv/undebate-ssp/issues/50

import React from "react"

import { Invitation } from "../app/components/invitation"

export default {
    title: "Invitation",
    component: Invitation,
    argTypes: {},
}

const Template = args => <Invitation {...args} />

export const InvitationTest = Template.bind({})

InvitationTest.args = {}
