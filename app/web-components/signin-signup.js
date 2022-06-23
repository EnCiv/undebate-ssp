////https://github.com/EnCiv/undebate-ssp/issues/108
'use strict'

import React, { useState } from 'react'

import SigninSignupCom from '../components/signin-signup'

function SigninSignup(props) {
    const { user } = props
    const [userInfo, setUserInfo] = useState(null)

    function onUserLogin(info) {
        logger.info('onUserLogin', info)
        setUserInfo({ info })
    }

    return (
        <>
            <div
                style={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    width: '100vw',
                    height: '100vh',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                }}
            >
                {!userInfo && !user ? (
                    <SigninSignupCom onChange={onUserLogin} destination={onUserLogin} />
                ) : (
                    <div>
                        <div>Welcome Aboard</div>
                        <div>info: {JSON.stringify(userInfo)}</div>
                        <div>user: {JSON.stringify(user)}</div>
                        <a href='/sign/out'>Log out</a>
                    </div>
                )}
            </div>
        </>
    )
}

export default SigninSignup
