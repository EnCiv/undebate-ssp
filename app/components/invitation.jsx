// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useState, useEffect } from "react"
import { createUseStyles } from "react-jss"
import cx from "classnames"
import TextareaAutosize from "react-textarea-autosize"
import ElectionTextInput from "./election-text-input"
import SubmitInvitationButton from "./submit_invitation_button"
import SvgSpeaker from "../svgr/speaker"

export var Invitation = function (props) {
    const { className, style } = props
    const classes = useStyles()
    const [moderatorName, setModeratorName] = useState("")
    const [moderatorEmail, setModeratorEmail] = useState("")
    const [greeting, setGreeting] = useState("")

    const validGreeting = () =>
        greeting
            .trim()
            .split(" ")
            .filter(word => word != "" && word != "\n").length <= 400

    const checkValid = () => validGreeting() && moderatorName.length > 0 && moderatorEmail.length > 0

    const [isValid, setIsValid] = useState(checkValid())

    useEffect(() => {
        setIsValid(checkValid())
    }, [moderatorName, moderatorEmail, greeting])

    const handleUpsert = () => {
        if (checkValid()) {
            props.electionMethods.upsert({ moderator: { email: moderatorEmail, name: moderatorName } })
        }
    }

    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.send}>
                <span>An invitation will be emailed to the moderator along with the script and a recording link</span>
                <SubmitInvitationButton
                    disabled={!isValid}
                    electionOM={props.electionOM}
                    onDone={() => {
                        emit("send-invite", props.electionObj._id, success => {
                            if (success) {
                                console.log("Success!")
                            }
                        })
                    }}
                />
            </div>
            <div className={classes.form}>
                <ElectionTextInput
                    name="Moderation Name"
                    onDone={({ valid, value }) => {
                        if (valid) {
                            setModeratorName(value)
                            handleUpsert()
                        }
                    }}
                />
                <ElectionTextInput
                    name="Email Address"
                    checkIsEmail
                    onDone={({ valid, value }) => {
                        if (valid) {
                            setModeratorEmail(value)
                            handleUpsert()
                        }
                    }}
                />
                <div className={classes.greeting}>
                    <label htmlFor="greeting" className={classes.label}>
                        Invitation greeting
                    </label>
                    <span className={classes.desc}>
                        This would be included in the invite email for the moderator. Not more than 400 words.
                    </span>
                    <TextareaAutosize
                        onBlur={e => {
                            const text = e.target.value
                            setGreeting(text)
                        }}
                        className={classes.textarea}
                        name="greeting"
                        minRows={7}
                        maxRows={7}
                    />
                </div>
            </div>
            <SvgSpeaker className={classes.speaker} />
        </div>
    )
}

const useStyles = createUseStyles({
    send: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        position: "relative",
    },
    form: {
        maxWidth: "20rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
    },
    speaker: {
        height: "18.75rem",
        position: "absolute",
        bottom: "0",
        right: "1rem",
    },
    label: {
        margin: "0 0.625rem",
        fontWeight: "600",
    },
    desc: {
        margin: ".3rem .4rem 0.625rem",
        fontSize: ".875rem",
        color: "#9da0a2",
    },
    greeting: {
        display: "flex",
        flexDirection: "column",
    },
    textarea: {
        width: "100%",
        borderRadius: "0.625rem",
        backgroundColor: "#d4d5d6",
        padding: "1rem 1.25rem",
        border: "none",
        fontSize: "1.125rem",
        fontFamily: "sans-serif",
        resize: "none",
    },
})

export default Invitation
