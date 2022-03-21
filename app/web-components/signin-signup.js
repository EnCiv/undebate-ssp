'use strict'

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import { AuthForm } from 'civil-client'

function SignInSignUp(props) {
    const classes = useStyles()
    const [userInfo, setUserInfo] = useState(null)

    function onUserLogin(info) {
        logger.info('onUserLogin', info)
        setUserInfo({ info })
    }

    return (
        <div style={{ width: '100vw', height: '100vh', textAlign: 'center', verticalAlign: 'middle' }}>
            {!userInfo ? (
                <AuthForm className={classes['join']} onChange={onUserLogin} />
            ) : (
                <div className={classes['join']}>
                    <div>Welcome Aboard</div>
                    <div>info: {JSON.stringify(userInfo)}</div>
                    <div>user: {JSON.stringify(props.user)}</div>
                </div>
            )}
        </div>
    )
}

const useStyles = createUseStyles({
    join: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        'button&': {
            'margin-left': '1em',
            'padding-top': '0.5em',
            'padding-bottom': '0.5em',
            '&:disabled': {
                'text-decoration': 'none',
                background: 'lightgray',
            },
        },
        'a&': {
            'margin-right': '0.25em',
        },
        'i&': {
            'margin-right': 0,
        },
    },
})

export default SignInSignUp
