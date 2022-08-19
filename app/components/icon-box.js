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
                    <div className={classes.headerBox}>
                        <h2>{subject}</h2>
                    </div>
                    <div className={classes.textBox}>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

const useStyles = createUseStyles({
    iconBox: {
        width: '100%',
        height: '100%'
    },
    icon: {
        height: '90%',
        width: '100%',
        display: 'block',
    },
    iconWrapper: {
        background: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%',
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
        height: '65%',
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
    },
    headerBox:{
        height: '30%'
    },
    textBox:{
        paddingTop: '0.5rem',
        height: '70%'
    }
    /* Frame 875694 */
})

export default IconBox
