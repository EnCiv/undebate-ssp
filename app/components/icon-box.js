// https://github.com/EnCiv/undebate-ssp/issues/113
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import SvgFitsInside from '../svgr/fits-inside'
const icons = {
    SvgFitsInside: SvgFitsInside,
}

function IconBox(props) {
    const { className, style, subject, description, iconName } = props
    const classes = useStyles()
    const Icon = icons[iconName] || SvgFitsInside

    return (
        <div className={cx(className, classes.background)} style={style}>
            <Icon className={classes.userImage} />
        </div>
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
