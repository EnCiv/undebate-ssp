'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/14

import cx from 'classnames'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

const Submit = ({ onDone, name = 'Submit', style, className, disabled = false, disableOnClick = false }) => {
    const classes = useStyles()
    const [clickedOnce, setClickedOnce] = useState(false)

    const handleOnClick = () => {
        if (!disabled) {
            onDone({ finished: true })
        }
        setClickedOnce(true)
    }

    const getDisabledClass = () => {
        let isDisabled = disabled
        if (disableOnClick && clickedOnce) {
            isDisabled = true
        }
        return { [classes.disabled]: isDisabled }
    }

    return (
        <button
            className={cx(className, classes.btn, getDisabledClass())}
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
            cursor: 'initial',
        },
    },
})

export default Submit
