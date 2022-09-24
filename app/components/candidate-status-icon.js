import React from "react";
import {createUseStyles} from "react-jss";

export default function CandidateStatusIcon({value, themeColorName, numberColor, displayText, visibleText = false}) {
    const classes = statusIconUseStyles({themeColorName, numberColor})
    return (
        <span>
            <span className={classes.statusIcon}>
                <span className={classes.text}>{value}</span>
            </span>
            {visibleText ? <span className={classes.statusText}>{displayText}</span> : ''}
        </span>
    )
}

const statusIconUseStyles = createUseStyles(theme => ({
    statusIcon: ({themeColorName}) => ({
        borderRadius: '3rem',
        backgroundColor: theme[themeColorName],
        margin: '0.75rem',
    }),
    text: ({numberColor}) => ({
        color: numberColor ?? theme.colorSecondary,
        padding: '0.625rem',
        fontWeight: 'bold',
    }),
    statusText: { margin: '0rem' },
}))
