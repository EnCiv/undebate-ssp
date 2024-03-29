import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import DefaultUserSVG from '../svgr/default-user'

function UserImage(props) {
    const { className, style } = props
    const classes = useStyles()

    return (
        <div className={cx(className, classes.background)} style={style}>
            <DefaultUserSVG className={classes.userImage} />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    userImage: {
        height: '70%',
        width: '70%',
    },
    background: {
        background: theme.backgroundColorApp,
        borderRadius: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '3.25rem',
        width: '3.25rem',
    },
}))

export default UserImage
