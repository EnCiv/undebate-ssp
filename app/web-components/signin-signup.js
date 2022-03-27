////https://github.com/EnCiv/undebate-ssp/issues/108
'use strict'

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import SigninSignupCom from '../components/signin-signup'

function SigninSignup(props) {
    const classes = useStyles()
    const [userInfo, setUserInfo] = useState(null)

    function onUserLogin(info) {
        logger.info('onUserLogin', info)
        setUserInfo({ info })
    }

    return (
        <>
            <div style={{ width: '100vw', height: '100vh', textAlign: 'center', verticalAlign: 'middle' }}>
                {!userInfo ? (
                    <SigninSignupCom className={classes['join']} onChange={onUserLogin} destination={'/home'} />
                ) : (
                    <div className={classes['join']}>
                        <div>Welcome Aboard</div>
                        <div>info: {JSON.stringify(userInfo)}</div>
                        <div>user: {JSON.stringify(props.user)}</div>
                    </div>
                )}
            </div>
        </>
    )
}

const useStyles = createUseStyles({
    join: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: '1.5rem',
    },
})

export default SigninSignup
