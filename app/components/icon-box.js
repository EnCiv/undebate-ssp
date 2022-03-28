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
                <div className={cx(className, classes.background)} style={style}>
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
    background: {
        background: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '21rem',
        width: '21rem',
        borderRadius: '1rem',
        padding: '1rem',
    },
    text: {
        color: 'black',
        '& h2': {
            fontSize: '2rem',
        },
    },
    /* Frame 875694 */
})

export default IconBox
