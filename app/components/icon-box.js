// https://github.com/EnCiv/undebate-ssp/issues/113
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import SvgFitsInside from '../svgr/fits-inside'
import SvgAutomate from '../svgr/automate'
import SvgShortFormat from '../svgr/short-format'
import { size } from 'lodash'
const icons = {
    SvgFitsInside: SvgFitsInside,
    SvgAutomate: SvgAutomate,
    SvgShortFormat: SvgShortFormat,
}

function IconBox(props) {
    const { className, style, subject, description, iconName } = props
    const classes = useStyles()
    const Icon = icons[iconName] || SvgFitsInside
    const Icon2 = icons[iconName] || SvgAutomate
    const Icon3 = icons[iconName] || SvgShortFormat
    return (
        <>
            <div className={classes.iconBox}>
                <div className={cx(className, classes.iconWrapper)} style={style}>
                    <Icon className={classes.userImage} />
                </div>
                <div className={classes.text}>
                    <h2>{subject}</h2>
                    <p>{description}</p>
                </div>
            </div>

            {/* </div> */}
        </>
    )
}

const useStyles = createUseStyles({
    iconBox: {
        width: '21rem',
    },
    userImage: {
        height: '100%',
        width: '100%',
        display: 'block',
    },
    iconWrapper: {
        background: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
        width: '19rem',
        borderRadius: '1rem',
        padding: '3rem',
        position: 'relative',
        zIndex: '2',
    },
    text: {
        color: 'black',
        '& h2': {
            fontSize: '2rem',
        },
        textAlign: 'center',
        lineHeight: '3rem',
        paddingTop: '2rem',
        marginLeft: '0.5rem',
        backgroundColor: 'rgba(116, 112, 255, 0.1)',
        width: '23rem',
        borderRadius: '1rem',
        position: 'relative',
        bottom: '2.5rem',
        zIndex: '1',
    },
    /* Frame 875694 */
})

export default IconBox
