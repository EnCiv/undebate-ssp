"use strict"

import React from "react"
import { createUseStyles } from "react-jss"
import cx from "classnames"

const LinkButton = props => {
    const { className, style, href, children } = props
    const classes = useStyles()
    return (
        <a className={cx(className, classes.link)} style={style} href={href}>
            <button className={classes.button}>{children}</button>
        </a>
    )
}

export default LinkButton

const useStyles = createUseStyles({
    button: {
        border: "none",
        background: "linear-gradient(0deg, #7470FF, #7470FF), #FFFFFF",
        borderRadius: "2rem",
        padding: "1rem 2rem",
        whiteSpace: "nowrap",
        color: "#FFFFFF",
    },
    a: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        textDecoration: "none",
        gap: "0.5rem",
    },
    svg: {
        width: "1.25rem",
        height: "1.25rem",
    },
})
