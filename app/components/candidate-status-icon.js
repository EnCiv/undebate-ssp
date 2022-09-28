import React from "react";
import {createUseStyles} from "react-jss";

export default function CandidateStatusIcon({value, themeColorName, numberColor, displayText, visibleText = false}) {
    const classes = useStyles({themeColorName, numberColor})

    const renderTooltip = () => {
        return <div className={classes.tooltip}>
            {displayText}
        </div>
    }
    let remSize = visibleText ? 2 : 1
    const iconStyle = {
        width: remSize + 'rem',
        height: remSize + 'rem',
    }
    const textStyle = {fontSize: (remSize * 0.75) + 'rem'}

    return (
        <div className={classes.wrapper}>
            <div className={classes.statusIcon} style={iconStyle}>
                <div className={classes.text} style={textStyle}>{value}</div>
                {visibleText ? '' : renderTooltip()}
            </div>
            {visibleText ?
                <span className={classes.statusText}>{displayText}</span>
                : ''
            }
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    statusIcon: ({themeColorName}) => ({
        borderRadius: '50%',
        backgroundColor: theme[themeColorName],
        marginLeft: '0.75rem',
        '&:hover $tooltip': {
            visibility: 'visible',
        },
    }),
    text: ({numberColor}) => ({
        color: numberColor ?? theme.colorSecondary,
        fontWeight: 'bold',
        verticalAlign: 'middle',
        textAlign: 'center',
        height: '100%',
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
