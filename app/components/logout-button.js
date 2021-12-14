"use strict"

import React from "react"
import { createUseStyles } from "react-jss"
import cx from "classnames"
import LogoutSVG from "../svgr/log-out"

const LogoutButton = props => {
    const { className, style } = props
    const classes = useStyles()
    return (
        <button className={cx(className, classes.logoutButton)} style={style}>
            <a className={classes.link} href="/sign/out">
                <LogoutSVG className={classes.svg} />
                LOGOUT
            </a>
        </button>
    )
}

export default LogoutButton

const useStyles = createUseStyles({
    logoutButton: {
        border: "none",
        background: "linear-gradient(0deg, #7470FF, #7470FF), #FFFFFF",
        borderRadius: "2rem",
        padding: "1rem 2rem",
        whiteSpace: "nowrap",
    },
    link: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        textDecoration: "none",
        color: "#FFFFFF",
        gap: "0.5rem",
    },
    svg: {
        width: "1.25rem",
        height: "1.25rem",
    },
})
