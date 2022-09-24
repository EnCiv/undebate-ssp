// https://github.com/EnCiv/undebate-ssp/issues/113
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import SvgFitsInside from '../svgr/fits-inside'
import SvgAutomate from '../svgr/automate'
import SvgShortFormat from '../svgr/short-format'

const icons = {
    SvgFitsInside: SvgFitsInside,
    SvgAutomate: SvgAutomate,
    SvgShortFormat: SvgShortFormat,
}

function IconBox(props) {
    const { className, style, subject, description, iconName } = props
    const classes = useStyles()
    const Icon = icons[iconName] || SvgFitsInside
    return (
        <>
            <div className={classes.iconBox}>
                <div className={cx(className, classes.iconWrapper)} style={style}>
                    <Icon className={classes.icon} />
                </div>
                <div className={classes.text}>
                    <h2>{subject}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </>
    )
}

const useStyles = createUseStyles({
    iconBox: {
        width: '100%',
        flex: '0 1 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    icon: {
        height: 'auto',
        width: '100%',
        display: 'block',
    },
    iconWrapper: {
        background: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
        width: '100%',
        borderRadius: '1rem',
        padding: '1rem',
        position: 'relative',
        zIndex: '2',
        boxSizing: 'border-box',
    },
    text: {
        color: 'black',
        '& h2': {
            fontSize: '1.25rem',
            lineHeight: '1.875rem',
        },
        textAlign: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
        lineHeight: '3rem',
        paddingTop: '2rem',
        backgroundColor: 'rgba(116, 112, 255, 0.1)',
        width: '90%',
        borderRadius: '1rem',
        position: 'relative',
        bottom: '2.5rem',
        zIndex: '1',
        left: '5%',

        '& p': {
            fontSize: '1rem',
            lineHeight: '1.5rem',
            color: '#808080',
        },
        flex: '0 1 auto',
        height: '100%',
    },
    /* Frame 875694 */
})

export default IconBox
