"use-strict"

// https://github.com/EnCiv/undebate-ssp/issues/15

import React from "react"
import { createUseStyles } from "react-jss"

export const SectionHeader = ({ name, className }) => {
    const classes = useStyles()

    return (
        <div className={`${classes.sectHeader} ${className}`}>
            <span className={classes.sectText}>{name}</span>
            <span className={classes.sectLine} />
        </div>
    )
}

const useStyles = createUseStyles({
    sectHeader: {
        display: "flex",
        alignItems: "center",
        gap: ".6rem",
    },
    sectText: {
        fontWeight: "bold",
        fontSize: "1.2rem",
        textTransform: "uppercase",
    },
    sectLine: {
        height: "1px",
        backgroundColor: "#262D33",
        opacity: 0.25,
        flex: 1,
    },
})
