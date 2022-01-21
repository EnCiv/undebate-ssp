// From issue: https://github.com/EnCiv/undebate-ssp/issues/7

import React, { useEffect, useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import Calendar from 'react-calendar'
import { SvgCalendar } from './lib/svg'
import 'react-calendar/dist/Calendar.css'

const splitDate = mdy => {
    const mMdDyY = mdy
        .split(/-|\//)
        .map(n => parseInt(n, 10))
        .filter(n => !Number.isNaN(n))
    if (mMdDyY[2] < 100) {
        const yy = new Date().getFullYear() % 100
        if (mMdDyY[2] <= yy + 1) mMdDyY[2] += 2000
        else mMdDyY[2] += 1900
    }
    return mMdDyY
}

const mdyToDate = mdy => {
    if (!isMdyValid(mdy)) {
        return new Date(NaN)
    }
    const [month, day, year] = splitDate(mdy)
    return new Date(year, month - 1, day)
}

const isMdyValid = mdy => {
    const [month, day, year] = splitDate(mdy)
    const date = new Date(year, month - 1, day)
    const yearLength = year?.toString().length
    if (
        !(yearLength === 2 || yearLength === 4) ||
        year !== date.getFullYear() ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return false
    }
    return true
}

const dateToMdy = date => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
}

export default function ElectionDateInput(props) {
    // defaultValue: mm/dd/yyyy string or a Date object
    // onDone: ({valid: bool, value: Date}): null
    const { defaultValue = '', onDone: propOnDone = () => {} } = props

    const today = new Date()

    const defaultDate = defaultValue instanceof Date ? dateToMdy(defaultValue) : defaultValue

    const [textDate, setTextDate] = useState(defaultDate)
    const [error, setError] = useState(null)
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const parentEl = useRef(null)

    const classes = useStyles({
        ...props,
        error,
        datePickerOpen,
    })

    useEffect(() => {
        const onNonDatepickerClick = e => {
            if (!parentEl.current.contains(e.target) && !e.target.className.includes(classes.datePickerPart)) {
                if (datePickerOpen) {
                    blurDateInput(textDate)
                }
                setDatePickerOpen(false)
            }
        }
        document.addEventListener('click', onNonDatepickerClick)
        return () => {
            document.removeEventListener('click', onNonDatepickerClick)
        }
    }, [textDate, datePickerOpen])

    // Calls onDone/validation for initial defaultValue
    useEffect(() => {
        propOnDone({ valid: isMdyValid(textDate), value: textDate })
    }, [])

    const onInputChange = e => {
        const { value } = e.target
        if ((value.length === 8 || value.length === 10) && !isMdyValid(value)) {
            setError('Please enter a valid date')
        } else {
            setError(null)
        }
        setTextDate(value)
    }
    const onDatePickerChange = date => {
        setError(null)
        setTextDate(dateToMdy(date))
    }

    const datePickerButtonOnClick = () => {
        blurDateInput(textDate, datePickerOpen ? null : true)
        setDatePickerOpen(!datePickerOpen)
    }
    const blurDateInput = _valid => {
        const valid = _valid === null ? isMdyValid(textDate) : _valid
        if (!valid) {
            setError('Please enter a valid date')
        }
        propOnDone({ valid: isMdyValid(textDate), value: textDate })
    }
    return (
        <div ref={parentEl}>
            <div className={classes.dateInputWrapper}>
                <span className={classes.inputContainer}>
                    <input
                        aria-label='Date Input'
                        className={classes.dateInput}
                        type='text'
                        maxLength='10'
                        required
                        value={textDate}
                        onChange={onInputChange}
                        onBlur={e => blurDateInput(e.target.value)}
                        placeholder='mm/dd/yyyy'
                    />
                    <button type='button' className={classes.datePickerButton} onClick={datePickerButtonOnClick}>
                        <SvgCalendar className={classes.icon} />
                    </button>
                </span>
                <span className={classes.errorText}>{error}</span>
            </div>
            {datePickerOpen && (
                <Calendar
                    className={classes.datePicker}
                    tileClassName={[classes.datePickerTile, classes.datePickerPart]}
                    value={isMdyValid(textDate) ? mdyToDate(textDate) : today}
                    onChange={onDatePickerChange}
                />
            )}
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    dateInputWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainer: props => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: `.1rem solid ${props.error ? 'red' : 'none'}`,
        borderRadius: theme.defaultBorderRadius,
        backgroundColor: theme.backgroundColorComponent,
        padding: theme.inputFieldPadding,
        width: '100%',
    }),
    dateInput: {
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: theme.inputFieldFontSize,
        fontFamily: theme.defaultFontFamily,
    },
    datePicker: {
        position: 'absolute',
        overflow: 'hidden',
        padding: '0.3rem',
        transform: 'translatex(-0.8rem)',
        borderRadius: '.5rem',
        boxShadow: '0rem 0rem 0.6rem #b4b5b6',
        backgroundColor: '#fcfdff',
        '@supports (backdrop-filter: blur(6rem))': {
            backdropFilter: 'blur(6rem)',
            background: '#fcfdff00',
        },
    },
    datePickerTile: {
        borderRadius: '0.5rem',
    },
    datePickerButton: {
        background: 'none',
        border: 'none',
        display: 'flex',
        cursor: 'pointer',
        padding: '0',
        height: '100%',
        transition: 'background-color 150ms',
        borderRadius: '100%',
        '&:hover': {
            backgroundColor: '#b4b5b6',
        },
    },
    errorText: {
        color: 'red',
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
    datePickerPart: {},
}))
