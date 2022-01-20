'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/14

import cx from 'classnames'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

function Submit({ onDone, name = 'Submit', style, className, disabled = false, disableOnClick = false }) {
    const classes = useStyles()
    const [disabledAfterClick, setDisabledAfterClick] = useState(false)

    const handleOnClick = () => {
        if (!disabled && !disabledAfterClick) {
            onDone({ valid: true })
        }
        if (disableOnClick) setDisabledAfterClick(true)
    }

    return (
        <button
            type='button'
            className={cx(className, classes.btn, (disabled || disabledAfterClick) && classes.disabled)}
            style={style}
            onClick={handleOnClick}
            disabled={disabled}
        >
            {name}
        </button>
    )
}

const useStyles = createUseStyles({
    btn: {
        borderRadius: '1.875rem',
        backgroundColor: '#7470FF',
        border: 'none',
        color: '#FFF',
        padding: '.9em 1.3em',
        fontWeight: 600,
        '&:hover': {
            cursor: 'pointer',
        },
    },
    disabled: {
        backgroundColor: '#919597',
        color: '#fff',
        '&:hover': {
            cursor: 'not-allowed',
        },
    },
})

export default Submit
