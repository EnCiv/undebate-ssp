// https://github.com/EnCiv/undebate-ssp/issues/50

import React from "react"
import { createUseStyles } from "react-jss"
import cx from "classnames"

// <SubmitInviteButton className="" style={} electionOM={} onClick={} disabled={false} />
export var SubmitInvitationButton = function (props) {
    const { className, style, disabled } = props
    const classes = useStyles()
    return (
        <button
            className={cx(className, classes.btn, { [classes.disabled]: disabled })}
            style={style}
            onClick={() => !disabled && props.onDone({ finished: true })}
            disabled={disabled}
        >
            Send Invite
        </button>
    )
}

const useStyles = createUseStyles({
    btn: {
        borderRadius: "1.875rem",
        backgroundColor: "#7470FF",
        border: "none",
        color: "#FFF",
        padding: ".9em 1.3em",
        fontWeight: 600,
        "&:hover": {
            cursor: "pointer",
        },
    },
    disabled: {
        backgroundColor: "#919597",
        color: "#fff",
        "&:hover": {
            cursor: "initial",
        },
    },
})

export default SubmitInvitationButton
