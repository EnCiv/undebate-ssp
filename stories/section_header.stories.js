// https://github.com/EnCiv/undebate-ssp/issues/15
import React from "react"

import { SectionHeader } from "../app/components/section_header"
import { createUseStyles } from "react-jss"

export default {
    title: "Section Header",
    component: SectionHeader,
    argTypes: {},
}

const useStyles = createUseStyles({
    section: {
        width: "20rem",
    },
})

const Template = args => <SectionHeader className={useStyles().section} {...args} />

export const SectionHeaderTest = Template.bind({})

SectionHeaderTest.args = { name: "Configuration" }
