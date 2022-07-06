import React, { useRef, useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

import LinkButton from './link-button'
import SignInButton from './sign-in-button'

import UserImage from './user-image'

import LogoutSVG from '../svgr/log-out'

export default function UserOrSignup(props) {
    const { style, className, user, destination } = props
    const [hoverWidth, setHoverWidth] = useState(0)
    const classes = useStyles({ hoverWidth })
    const hoverRef = useRef()
    useEffect(() => {
        if (hoverRef.current) setHoverWidth(hoverRef.current.getBoundingClientRect().width)
    })
    if (user) {
        return (
            <div className={cx(className, classes.userOrSignup)} style={style}>
                <div className={classes.hoverGroup}>
                    <div ref={hoverRef} className={classes.hoverWrapper}>
                        <span className={classes.innerWrapper}>
                            <span className={classes.userEmail}>{user.email}</span>
                            <LinkButton className={classes.signout} href='/sign/out'>
                                <LogoutSVG className={classes.svg} />
                                LOGOUT
                            </LinkButton>
                        </span>
                    </div>
                </div>
                <UserImage className={classes.userImage} />
            </div>
        )
    } else {
        return (
            <SignInButton
                className={cx(className, classes.signin)}
                style={style}
                name={'Sign Up / Log In'}
                destination={destination}
            />
        )
    }
}

const useStyles = createUseStyles(theme => ({
    svg: {
        width: theme.iconSize,
        height: theme.iconSize,
        display: 'inline-flex',
    },
    userOrSignup: ({ hoverWidth }) => ({
        display: 'inline-block',
        alignItems: 'center',
        background: theme.colorPrimary,
        height: '3.25rem',
        border: 'none',
        borderRadius: theme.buttonBorderRadius,
        width: 'max-content',
        overflow: 'hidden',
        '&:hover': {
            '& > $hoverGroup': {
                width: `${hoverWidth}px`,
            },
        },
    }),
    userImage: {
        display: 'inline-flex',
        verticalAlign: 'top',
    },
    hoverWrapper: {
        display: 'inline-block',
        width: 'auto',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    innerWrapper: {
        whiteSpace: 'nowrap',
        lineHeight: '3.25rem',
        height: '100%',
        vertialAlign: 'middle',
    },
    hoverGroup: {
        transition: 'width 0.5s',
        display: 'inline-block',
        height: '3.25rem',
        overflow: 'hidden',
        borderRadius: theme.buttonBorderRadius,
        width: '0',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userEmail: {
        verticalAlign: 'middle',
        opacity: theme.secondaryTextOpacity,
        color: '#FFFFFF',
        marginLeft: '2rem',
        marginRight: '1rem',
    },
    signout: {
        paddingRight: '1rem',
        display: 'inline-flex',
        verticalAlign: 'middle',
    },
    signin: {
        display: 'inline-block',
    },
}))
