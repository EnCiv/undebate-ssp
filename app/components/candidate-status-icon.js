import React from "react";
import {createUseStyles} from "react-jss";

export default function CandidateStatusIcon({value, themeColorName, numberColor, displayText, visibleText = false}) {
    const classes = useStyles({themeColorName, numberColor})

    const renderTooltip = () => {
        return <div className={classes.tooltip}>
            {displayText}
        </div>
    }

    return (
        <span>
            <span className={classes.statusIcon}>
                <span className={classes.text}>{value}</span>
                {visibleText ? '' : renderTooltip()}
            </span>
            {visibleText ?
                <span className={classes.statusText}>{displayText}</span>
                : ''
            }
        </span>
    )
}

const useStyles = createUseStyles(theme => ({
    statusIcon: ({themeColorName}) => ({
        borderRadius: '3rem',
        backgroundColor: theme[themeColorName],
        marginLeft: '0.75rem',
        '&:hover $tooltip': {
            visibility: 'visible',
        },
    }),
    text: ({numberColor}) => ({
        color: numberColor ?? theme.colorSecondary,
        padding: '0.625rem',
        fontWeight: 'bold',
    }),
    statusText: {
        margin: '0 0 0 0.75rem',
    },
    tooltip: {
        visibility: 'hidden',
        position: 'absolute',
        zIndex: 1,
        backgroundColor: theme.colorSecondary,
        color: theme.colorLightGray,
        padding: '1rem',
        borderRadius: theme.defaultBorderRadius,
    },
}))
