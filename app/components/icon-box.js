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
    const Icon2 = icons[iconName] || SvgAutomate
    const Icon3 = icons[iconName] || SvgShortFormat
    return (
        <>
            <div className='iconBox'>
                <div className={cx(className, classes.background)} style={style}>
                    <Icon />
                </div>
                <div>
                    <h2>{subject}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </>
    )
}

const useStyles = createUseStyles({
    userImage: {
        height: '70%',
        width: '70%',
    },
    background: {
        background: 'white',
        borderRadius: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '3.25rem',
        width: '3.25rem',
    },
})

export default IconBox
