import React from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import theme from '../theme'

const useStyles = createUseStyles({
    SignInSignUp: {
        backgroundColor: theme.colorPrimary,
        width: '300px',
        margin: '0 auto',
        borderRadius: '5%',
        height: '380px',
        padding: '3%',
        paddingTop: '6%',
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
    links: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    loginLink: {
        // marginRight: '3%',
    },
    signinLink: {
        opacity: '0.5',
    },
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
        marginBottom: '18%',
    },
    inputContainer: {
        width: '100%',
        paddingTop: '10%',
    },
    input: {
        width: '95%',
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        height: '8vh',
        color: '#FFFFFF',
        marginBottom: '3vh',
        borderRadius: '10px',
        paddingLeft: '5%',
    },
    reminderContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    passwordLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
        '&:hover': {
            color: '#fec215',
        },
        fontSize: '0.8rem',
        width: '50%',
    },
    rememberLabel: {
        color: '#FFFFFF',
        fontSize: '0.8rem',
        width: '50%',
    },
})

export default function SignInSignUp() {
    const classes = useStyles()
    return (
        <div className={classes.SignInSignUp}>
            <div className={classes.links}>
                <div className={classes.loginLink}>
                    <a href='#' className={classes.aLink}>
                        Log In
                    </a>
                </div>
                <div className={classes.signinLink}>
                    <a href='#' className={classes.aLink}>
                        Sign In
                    </a>
                </div>
            </div>
            {/* <div>
                <a href='#'>Sign Up</a>
            </div> */}
            <div className={classes.inputContainer}>
                <input placeholder='Email Address' className={classes.input}></input>
                <input placeholder='Password' className={classes.input}></input>
            </div>
            <div className={classes.btnContainer}>
                <button className={classes.btn}>Log In</button>
            </div>
            <div className={classes.reminderContainer}>
                <div>
                    <input type='checkbox' />
                    <label className={classes.rememberLabel}>Remember me</label>
                </div>

                <div>
                    <a href='#' className={classes.passwordLink}>
                        Forget password
                    </a>
                </div>
            </div>
        </div>
    )
}
