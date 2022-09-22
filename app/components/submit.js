'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/14

import cx from 'classnames'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Spinner from './spinner'

function Submit({ onDone, name = 'Submit', style, className, disabled = false, disableOnClick = false }) {
    const classes = useStyles()
    const [disabledAfterClick, setDisabledAfterClick] = useState(false)
    const [awaitingResponse, setAwaitingResponse] = useState(false)

    const handleOnClick = async () => {
        setAwaitingResponse(true)
        if (!disabled && !disabledAfterClick) {
            await onDone({ valid: true })
        }
        if (disableOnClick) setDisabledAfterClick(true)
        setAwaitingResponse(false)
    }

    return (
        <>
            {!awaitingResponse ? (
                <button
                    type='button'
                    className={cx(className, classes.btn, (disabled || disabledAfterClick) && classes.disabled)}
                    style={style}
                    onClick={handleOnClick}
                    disabled={disabled}
                >
                    {name}
                </button>
            ) : (
                <Spinner style={{ justifyContent: 'right', paddingRight: '1rem' }} />
            )}
        </>
    )
}

const useStyles = createUseStyles(theme => ({
    btn: {
        ...theme.button,
        backgroundColor: theme.colorPrimary,
        border: 'none',
        color: '#FFF',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    disabled: {
        backgroundColor: theme.colorPrimary,
        opacity: theme.disabledOpacity,
        color: '#fff',
        '&:hover': {
            cursor: 'not-allowed',
        },
    },
}))

export default Submit
