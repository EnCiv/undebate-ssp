////https://github.com/EnCiv/undebate-ssp/issues/108
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { createUseStyles, ThemeProvider } from 'react-jss'
import theme from '../theme'
import { useAuth } from 'civil-client'

export default function SignInSignUp(props) {
    const [userInfo, setUserInfo] = useState(false)
    const [isLogIn, setIsLogIn] = useState(true)
    const { destination } = props
    const classes = useStyles()
    const [state, methods] = useAuth(destination, {})
    useEffect(() => {
        window.socket = {
            emit: (handle, email, href, cb) => {
                if (handle !== 'send-password') console.error('emit expected send-password, got:', handle)
                if (email === 'success@email.com') setTimeout(() => cb({ error: '' }), 1000)
                else setTimeout(() => cb({ error: 'User not found' }), 1000)
            },
            onHandlers: {},
            on: (handle, handler) => {
                window.socket.onHandlers[handle] = handler
            },
            close: () => {
                if (window.socket.onHandlers.connect) setTimeout(window.socket.onHandlers.connect, 1000)
                else console.error('No connect handler registered')
            },
            removeListener: () => {},
        }
    }, [])
    return (
        <div className={classes.SignInSignUp}>
            <div className={classes.links}>
                <div className={classes.loginLink}>
                    <button onClick={e => setIsLogIn(false)} className={classes.btnClick}>
                        Sign Up
                    </button>
                </div>
                <div className={classes.loginLink}>
                    <button onClick={e => setIsLogIn(true)} className={classes.btnClick}>
                        Log In
                    </button>
                </div>
            </div>

            <div className={classes.inputContainer}>
                <input
                    name='first-name'
                    placeholder='First Name'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                ></input>
                <input
                    name='last-name'
                    placeholder='Last Name'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                ></input>
                <input
                    name='email'
                    placeholder='Email Address'
                    className={classes.input}
                    onChange={e => methods.onChangeEmail(e.target.value)}
                ></input>
                <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    className={classes.input}
                    onChange={e => methods.onChangePassword(e.target.value)}
                ></input>
                <input
                    name='confirm'
                    type='password'
                    placeholder='Confirm Password'
                    className={cx(classes.input, isLogIn && classes.disabled)}
                    onChange={e => methods.onChangeConfirm(e.target.value)}
                ></input>
            </div>
            <div className={classes.btnContainer}>
                <button className={cx(classes.btn, isLogIn && classes.disabled)} onClick={e => methods.signup()}>
                    Sign Up
                </button>
                <button className={cx(classes.btn, !isLogIn && classes.disabled)} onClick={e => methods.login()}>
                    Log In
                </button>
            </div>

            <div className={classes.resetPasswordBtn}>
                <button onClick={e => methods.sendResetPassword()} className={classes.resetBtn}>
                    Send Reset Password
                </button>
            </div>
            <div className={cx(classes.agreeTermContainer, isLogIn && classes.disabled)}>
                <div className={classes.checkTerm}>
                    <input type='checkbox' name='agreed' onClick={e => methods.onChangeAgree(e.target.checked)} />
                    <label className={classes.agreeTermLabel}>
                        I agree to the
                        <a href='https://enciv.org/terms' target='_blank' className={classes.aLinkTerm}>
                            Term of Service
                        </a>
                    </label>
                </div>
            </div>
            <div>
                {state.error && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.error}</div>}
                {state.info && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.info}</div>}
                {state.success && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.success}</div>}
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    SignInSignUp: {
        backgroundColor: theme.colorPrimary,
        width: '22rem',
        margin: '0 auto',
        borderRadius: '2rem',
        height: 'auto',
        padding: '3%',
        paddingTop: '4.5%',
        fontFamily: theme.defaultFontFamily,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
    },
    aLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
        fontSize: '2rem',
        '&:hover': {
            color: '#fec215',
            cursor: 'pointer',
        },
    },
    btnClick: {
        color: '#FFFFFF',
        textDecoration: 'none',
        fontSize: '2rem',
        background: 'none',
        border: 'none',
        '&:hover': {
            color: '#fec215',
            cursor: 'pointer',
        },
    },
    aLinkTerm: {
        color: '#fec215',
        marginLeft: '2%',
        textDecoration: 'none',
        fontSize: '1rem',
        '&:hover': {
            color: '#FFFFFF',
            cursor: 'pointer',
        },
    },
    links: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    signinLink: {},
    btnContainer: {
        width: '100%',
    },
    btn: {
        ...theme.button,
        backgroundColor: '#262D33',
        color: '#FFFFFF',
        display: 'block',
        margin: '0 auto',
        width: '60%',
        textAlign: 'center',
        fontSize: '1.25em',
        '&:hover': {
            backgroundColor: '#fec215',
            cursor: 'pointer',
            color: theme.colorPrimary,
        },
        marginBottom: '15%',
    },
    inputContainer: {
        width: '100%',
        paddingTop: '10%',
        margin: '0 auto',
    },
    input: {
        width: '95%',
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        height: '5vh',
        marginBottom: '2vh',
        borderRadius: '0.5rem',
        paddingLeft: '5%',
    },
    resetPasswordBtn: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '0 auto',
        cursor: 'pointer',
    },
    resetBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.15rem',
        color: '#FFFFFF',
        paddingBottom: '10%',
        cursor: 'pointer',
        '&:hover': {
            color: '#fec215',
        },
    },
    agreeTermContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '7%',
        margin: '0 auto',
    },
    checkTerm: {
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        alignItems: 'center',
    },
    agreeTermLabel: {
        width: '100%',
        color: '#FFFFFF',
        fontSize: '1rem',
        marginLeft: '2%',
    },
    disabled: {
        display: 'none',
    },
})
