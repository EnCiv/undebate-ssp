// https://github.com/EnCiv/undebate-ssp/issues/113
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import FitsInsideSVG from '../svgr/fits-inside'

function IconBox(props) {
    const { className, style } = props
    const classes = useStyles()

    return (
        <div className={cx(className, classes.background)} style={style}>
            <FitsInsideSVG className={classes.userImage} />
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
