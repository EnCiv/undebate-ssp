// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useState } from "react"

import { SubmitInvitationButton } from "../app/components/submit_invitation_button"
import { createUseStyles } from "react-jss"

export default {
    title: "Submit Invitation Button",
    component: SubmitInvitationButton,
    argTypes: {},
}

const useStyles = createUseStyles({
    alert: {
        margin: "1rem 0",
        padding: "1rem",
        width: "fit-content",
    },
    done: {
        color: "#4F8A10",
        backgroundColor: "#DFF2BF",
    },
    unfinished: {
        color: "#9F6000",
        backgroundColor: "#FEEFB3",
    },
})

const Template = args => {
    const [done, setDone] = useState(false)
    const styles = useStyles()
    return (
        <>
            <div className={`${styles.alert} ${done ? styles.done : styles.unfinished}`}>
                {done ? "Done!" : "Unfinished"}
            </div>
            <SubmitInvitationButton
                onDone={finished => {
                    setDone(finished)
                }}
                {...args}
            />
        </>
    )
}

export const SubmitInvitationTest = Template.bind({})

SubmitInvitationTest.args = {}
