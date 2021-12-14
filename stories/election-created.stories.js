// https://github.com/EnCiv/undebate-ssp/issues/17

import { ElectionCreated } from "../app/components/election-created"
import React from "react"

export default {
    title: "Election Created",
    component: ElectionCreated,
    argTypes: {},
}

const Template = args => <ElectionCreated {...args} />

export const ElectionCreatedTest = Template.bind({})

ElectionCreatedTest.args = {
    electionMetadata: {
        _id: "6199481498ac4e36c8a64753",
    },
}
