import React, { useState, createRef } from 'react'
import SignInSignUp from './signin-signup'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useClickAway } from 'react-use'

export default function SignInButton(props) {
    const { className, style, name = 'Sign In', destination } = props
    const classes = useStyles()
    const [showPopup, setShowPopup] = useState(false)
    const signRef = createRef(null)
    useClickAway(signRef, () => setShowPopup(!showPopup), ['click'])
    return (
        <div className={cx(className, classes.signInButton)} style={style}>
            <button className={cx(classes.btn, showPopup && classes.active)} onClick={() => setShowPopup(!showPopup)}>
                {name}
            </button>
            {showPopup && (
                <SignInSignUp
                    ref={signRef}
                    startTab={name}
                    destination={
                        typeof destination === 'string'
                            ? destination
                            : value => {
                                  setShowPopup(false)
                                  if (typeof destination === 'function') destination(value)
                              }
                    }
                />
            )}
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    signInButton: {},
    btn: {
        ...theme.button,
        backgroundColor: theme.colorPrimary,
        border: 'none',
        color: '#FFF',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    active: {
        backgroundColor: theme.colorPrimary,
        opacity: theme.disabledOpacity,
        color: '#fff',
    },
}))
