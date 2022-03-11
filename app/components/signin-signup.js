import React from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import theme from '../theme'

const useStyles = createUseStyles({
    SignInSignUp: {
        backgroundColor: theme.colorPrimary,
        width: '40%',
        margin: '0 auto',
        borderRadius: '6%',
        height: '60vh',
        padding: '3%',
        fontFamily: theme.defaultFontFamily,
    },
    aLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
        fontSize: '2.5rem',
        '&:hover': {
            color: '#fec215',
            cursor: 'pointer',
        },
    },
    links: {
        width: '100%',
        display: 'flex',
        justifyContent: 'left',
    },
    loginLink: {
        marginRight: '5%',
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
        width: '100%',
        textAlign: 'center',
        fontSize: '1.25em',
        '&:hover': {
            backgroundColor: '#fec215',
            cursor: 'pointer',
            color: theme.colorPrimary,
        },
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        height: '10vh',
        color: '#FFFFFF',
        marginBottom: '3vh',
        borderRadius: '10px',
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
            <div>
                <input type='checkbox' />
                <label>Remember me</label>
            </div>

            <div>
                <a>Forget password</a>
            </div>
        </div>
    )
}
