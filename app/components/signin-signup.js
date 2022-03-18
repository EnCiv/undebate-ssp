////https://github.com/EnCiv/undebate-ssp/issues/108
import React, { useState } from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import theme from '../theme'
import { useAuth } from 'civil-client'

export default function SignInSignUp(props) {
    const [userInfo, setUserInfo] = useState(false)
    const classes = useStyles()
    function onChange(userInfo) {
        setUserInfo(true)
    }
    const [state, methods] = useAuth(onChange, {})
    return (
        <div className={classes.SignInSignUp}>
            <div className={classes.links}>
                <div className={classes.loginLink}>
                    <button onClick={e => methods.signup()} className={classes.btnClick}>
                        Sign Up
                    </button>{' '}
                </div>
                <div className={classes.loginLink}>
                    <button onClick={e => methods.login()} className={classes.btnClick}>
                        Log In
                    </button>{' '}
                </div>
            </div>

            <div className={classes.inputContainer}>
                <input name='first-name' placeholder='First Name' className={classes.input}></input>
                <input name='last-name' placeholder='Last Name' className={classes.input}></input>
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
                    className={classes.input}
                    onChange={e => methods.onChangeConfirm(e.target.value)}
                ></input>
            </div>
            <div className={classes.btnContainer}>
                <button className={classes.btn} onClick={e => methods.signup()}>
                    Sign Up
                </button>
            </div>
            <div className={classes.resetPasswordBtn}>
                <button onClick={e => methods.sendResetPassword()} className={classes.resetBtn}>
                    Send Reset Password
                </button>
            </div>
            <div className={classes.agreeTermContainer}>
                <div className={classes.checkTerm}>
                    <input type='checkbox' name='agreed' onClick={e => methods.onChangeAgree(e.target.checked)} />
                    <label className={classes.agreeTermLabel}>
                        I agree to the{' '}
                        <a href='https://enciv.org/terms' target='_blank' className={classes.aLinkTerm}>
                            Term of Service
                        </a>
                    </label>
                </div>
            </div>
            <div>
                {state.error && <div style={{ color: '#fec215', textAlign: 'center' }}>{state.error}</div>}
                {state.info && <div>{state.info}</div>}
                {state.success && <div style={{ color: 'green', textAlign: 'center' }}>{state.success}</div>}
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    SignInSignUp: {
        backgroundColor: theme.colorPrimary,
        width: '22rem',
        margin: '0 auto',
        borderRadius: '5%',
        height: 'auto',
        padding: '3%',
        paddingTop: '4.5%',
        fontFamily: theme.defaultFontFamily,
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
        textDecoration: 'none',
        fontSize: '0.8rem',
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
        width: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        height: '5vh',
        color: '#FFFFFF',
        marginBottom: '2vh',
        borderRadius: '0.5rem',
        paddingLeft: '5%',
    },
    resetPasswordBtn: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '0 auto',
    },
    resetBtn: {
        background: 'none',
        border: 'none',
        fontSize: '0.9rem',
        color: '#FFFFFF',
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
    },
    agreeTermLabel: {
        color: '#FFFFFF',
        fontSize: '0.8rem',
        marginLeft: '2%',
    },
})
