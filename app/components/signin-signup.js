import React from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import SignInButton from './sign-in-button'
import SignUpButton from './sign-up-button'
import theme from '../theme'

export default function SignInSignUp() {
    const classes = useStyles()
    return (
        <div className={classes.SignInSignUp}>
            <div className={classes.links}>
                <div className={classes.loginLink}>
                    <a href='#' className={classes.aLink}>
                        Register
                    </a>
                </div>
                <div className={classes.signinLink}>
                    <a href='#' className={classes.aLink}>
                        <SignInButton />
                    </a>
                </div>
                <div className={classes.signinLink} style={{ display: 'none' }}>
                    <a href='#' className={classes.aLink}>
                        <SignUpButton />
                    </a>
                </div>
            </div>

            <div className={classes.inputContainer}>
                <input name='first-name' placeholder='First Name' className={classes.input}></input>
                <input name='last-name' placeholder='Last Name' className={classes.input}></input>
                <input name='email' placeholder='Email Address' className={classes.input}></input>
                <input name='password' type='password' placeholder='Password' className={classes.input}></input>
                <input name='confirm' type='password' placeholder='Confirm Password' className={classes.input}></input>
            </div>
            <div className={classes.btnContainer}>
                <button className={classes.btn}>Log In</button>
            </div>
            <div className={classes.agreeTermContainer}>
                <div className={classes.checkTerm}>
                    <input type='checkbox' />
                    <label className={classes.agreeTermLabel}>
                        I agree to the{' '}
                        <a href='https://enciv.org/terms' target='_blank' className={classes.aLinkTerm}>
                            Term of Service
                        </a>
                    </label>
                </div>
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
    loginLink: {
        // marginRight: '3%',
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
