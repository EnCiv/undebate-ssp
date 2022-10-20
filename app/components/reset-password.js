import React, {useState, useEffect} from 'react'
import { createUseStyles } from 'react-jss'
import cx from "classnames";

export default function ResetPassword ({activationToken, returnTo }) {
    const classes = useStyles()

    const [infoMessage, setInfoMessage] = useState('')
    const [formError, setFormError] = useState('')
    const [resetKey, setResetKey] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [token, setToken] = useState(activationToken)
    const PASSWORD_MISMATCH_ERROR = "Passwords don't match"

    useEffect(() => {
        setToken(activationToken)
    }, [activationToken])

    const sendResetPassword = e => {
        e.preventDefault()
        setFormError('')
        if (newPassword !== confirmPassword) {
            setInfoMessage('')
            setFormError(PASSWORD_MISMATCH_ERROR)
            return
        }
        setInfoMessage('One moment...')
        window.socket.emit('reset-password', token, resetKey, newPassword, error => {
            if (error) {
                setInfoMessage('')
                setFormError('Error resetting password, please try again or contact support')
                console.error('Error resetting password: ', error)
                return
            }
            setInfoMessage('')
            setFormError('')
            // todo is the timeout really necessary?
            setTimeout(() => (location.href = returnTo || '/join'), 800)
        })
    }

    const updateResetKeyValue = e => {
        setResetKey(e.target.value)
    }

    const updateNewPasswordValue = e => {
        setNewPassword(e.target.value)
        if (newPassword && newPassword !== e.target.value) {
            setFormError(PASSWORD_MISMATCH_ERROR)
        } else {
            setFormError('')
        }
    }

    const updateConfirmPasswordValue = e => {
        setConfirmPassword(e.target.value)
        if (newPassword !== e.target.value) {
            setFormError(PASSWORD_MISMATCH_ERROR)
        } else {
            setFormError('')
        }
    }

    const attemptResetPassword = e => {
        e.preventDefault()
    }

    return (
        <div className={classes.formWrapper}>
            <div className={classes.header}>Reset Password</div>
            <form onSubmit={sendResetPassword}>
                <div className={classes.inputContainer}>
                <input
                    name={'resetKey'}
                    placeholder={'Reset Key from Email'}
                    className={classes.input}
                    onChange={updateResetKeyValue}
                />
                <input
                    name={'newPassword'}
                    type={'password'}
                    placeholder={'New Password'}
                    className={classes.input}
                    onChange={updateNewPasswordValue}
                />
                <input
                    name={'confirmPassword'}
                    type={'password'}
                    placeholder={'Confirm Password'}
                    className={cx(classes.input, classes.disabled)}
                    onChange={updateConfirmPasswordValue}
                />
                <div className={classes.buttonWrapper}>
                    <button className={classes.btn} onClick={attemptResetPassword}>
                        Reset
                    </button>
                </div>
                {infoMessage && <span>{infoMessage}</span>}
                {formError && <div className={classes.formValidationErrors}>{formError}</div>}
                </div>
            </form>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    formWrapper: {
        backgroundColor: theme.colorPrimary,
        width: '24rem',
        maxWidth: '100vw',
        margin: 0,
        borderRadius: '1rem',
        height: 'auto',
        padding: '0',
        fontFamily: theme.defaultFontFamily,
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
    },
    header: {
        textAlign: 'center',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        position: 'relative',
        color: '#FFFFFF',
        textDecoration: 'none',
        fontSize: '2rem',
        background: 'none',
        border: 'none',
    },
    inputContainer: {
        margin: 0,
        padding: '2rem',
        borderRadius: '0 0 1rem 1rem',
        backgroundColor: theme.colorPrimary,
    },
    input: {
        width: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        fontSize: '1.5rem',
        border: 'none',
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '0.5rem',
        boxSizing: 'border-box',
    },
    btnWrapper: {
        width: '100%',
    },
    btn: {
        ...theme.button,
        borderRadius: '.5rem',
        backgroundColor: '#262D33',
        color: '#FFFFFF',
        display: 'block',
        margin: '1rem auto',
        textAlign: 'center',
        fontSize: '2rem',
        width: '100%',
        '&:hover': {
            backgroundColor: '#fec215',
            cursor: 'pointer',
            color: theme.colorPrimary,
        },
    },
}))