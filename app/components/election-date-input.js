// From issue: https://github.com/EnCiv/undebate-ssp/issues/7

import React, { useEffect, useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import Calendar from 'react-calendar'
import { Calendar as SvgCalendar } from '../svgr'
import { useClickAway } from 'react-use'

// added this line to postinstall.js to make this work
// node_modules/jss-cli/bin/jss.js convert node_modules/react-calendar/dist/Calendar.css -f js -e cjs > node_modules/react-calendar/dist/react-calendar-css.js
// don't for get to call useCalendarStyle() in the react component below to get the styles pulled in
import reactCalendarCss from 'react-calendar/dist/react-calendar-css'
const useReactCalendarCss = createUseStyles(reactCalendarCss)

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
    if (!isMdyValid(mdy)) return new Date(NaN)
    const [month, day, year] = splitDate(mdy)
    return new Date(year, month - 1, day)
}

const isMdyValid = mdy => {
    const str = new Date(mdy).toLocaleDateString()
    return str !== 'Invalid Date'
}

function toLocaleDateStr(str) {
    const localeDate = new Date(str).toLocaleDateString()
    return localeDate !== 'Invalid Date' ? localeDate : str
}

function toISODateValidValue(str) {
    // .toISOString throws an error if date is invalid so we check the date first
    const locale = new Date(str).toLocaleDateString()
    if (locale == 'Invalid Date') return { valid: false, value: str }
    else return { valid: true, value: new Date(str).toISOString().split('T')[0] }
}

export default function ElectionDateInput(props) {
    // defaultValue: mm/dd/yyyy string
    // onDone: ({valid: bool, value: Date}): null
    const { defaultValue = '', disabled = false, onDone = () => {} } = props

    const [error, setError] = useState(null)
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const parentRef = useRef(null)
    const inputRef = useRef(null)

    const localeDefaultValue = toLocaleDateStr(defaultValue)
    // onDone for initial render
    useEffect(() => onDone({ value: defaultValue, valid: isMdyValid(localeDefaultValue) }), [])
    // onDone after defaultValue is changed from the top down
    useEffect(() => {
        if (!inputRef.current || inputRef.current.value === localeDefaultValue) return
        inputRef.current.value = localeDefaultValue
        onDone({ value: defaultValue, valid: isMdyValid(localeDefaultValue) })
    }, [defaultValue])

    const classes = useStyles({
        disabled,
        error,
    })

    useReactCalendarCss() // have to do this to get it pulled in

    useClickAway(parentRef, () => {
        if (datePickerOpen) {
            blurDateInput(inputRef.current.value)
        }
        setDatePickerOpen(false)
    })

    const onInputChange = e => {
        const { value } = e.target
        if ((value.length === 8 || value.length === 10) && !isMdyValid(value)) {
            setError('Please enter a valid date')
        } else {
            setError(null)
        }
    }
    const onDatePickerChange = date => {
        const value = date.toLocaleDateString()
        const valid = isMdyValid(value)
        if (!valid) setError('Please enter a valid date')
        else setError(null)
        inputRef.current.value = value // to prevent extra iteration of onDone after defaultValue is changed from parent
        //no need for onDone({ valid, value }) here - blurDateInput will get called when the Calendar is closed
        if (datePickerOpen) setDatePickerOpen(false)
        blurDateInput(value)
    }

    const blurDateInput = value => {
        const valid = isMdyValid(value)
        if (!valid) {
            setError('Please enter a valid date')
        }
        onDone(toISODateValidValue(value))
    }

    return (
        <div ref={parentRef}>
            <div className={classes.dateInputWrapper}>
                <span className={classes.inputContainer}>
                    <input
                        aria-label='Date Input'
                        className={classes.dateInput}
                        type='text'
                        maxLength='10'
                        required
                        disabled={disabled}
                        onChange={onInputChange}
                        ref={inputRef}
                        onBlur={e => blurDateInput(e.target.value)}
                        placeholder='mm/dd/yyyy'
                        defaultValue={localeDefaultValue}
                        key='input'
                    />
                    <button
                        disabled={disabled}
                        type='button'
                        className={classes.datePickerButton}
                        onClick={() => setDatePickerOpen(!datePickerOpen)}
                        key='button'
                    >
                        <SvgCalendar className={classes.icon} />
                    </button>
                </span>
                <span className={classes.errorText}>{error}</span>
            </div>
            {datePickerOpen && (
                <Calendar
                    className={classes.datePicker}
                    tileClassName={[classes.datePickerTile, classes.datePickerPart]}
                    value={isMdyValid(inputRef.current.value) ? mdyToDate(inputRef.current.value) : new Date()}
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
        outline: `.1rem solid ${props.error ? 'red' : 'none'}`,
        borderRadius: theme.defaultBorderRadius,
        backgroundColor: theme.backgroundColorComponent,
        padding: theme.inputFieldPadding,
        width: '100%',
    }),
    dateInput: props => ({
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: theme.inputFieldFontSize,
        fontFamily: theme.defaultFontFamily,
        color: props.disabled ? 'grey' : 'black',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        width: '100%',
    }),
    datePicker: {
        position: 'absolute',
        overflow: 'hidden',
        padding: '0.3rem',
        transform: 'translatex(-0.8rem)',
        borderRadius: '.5rem',
        boxShadow: '0rem 0rem 0.6rem #b4b5b6',
        backgroundColor: '#fcfdff',
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
