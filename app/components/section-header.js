'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/15

import React from 'react'
import { createUseStyles } from 'react-jss'

export default function SectionHeader({ name, className }) {
    const classes = useStyles()

    return (
        <div className={`${classes.sectHeader} ${className}`}>
            <span className={classes.sectText}>{name}</span>
            <span className={classes.sectLine} />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    sectHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '.6rem',
    },
    sectText: {
        fontWeight: 'bold',
        fontSize: theme.headerFontSize,
        textTransform: 'uppercase',
    },
    sectLine: {
        height: '1px',
        backgroundColor: theme.colorSecondary,
        opacity: 0.25,
        flex: 1,
    },
}))
