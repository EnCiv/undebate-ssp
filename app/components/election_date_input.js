// From issue: https://github.com/EnCiv/undebate-ssp/issues/7

import React, { useEffect, useState, useRef } from "react"
import { createUseStyles } from "react-jss"

import Calendar from "react-calendar"
import { SvgCalendar } from "./lib/svg.js"

import "react-calendar/dist/Calendar.css"

export var ElectionDateInput = function (props) {
    // defaultValue: mm/dd/yyyy string or a Date object
    // onDone: ({valid: bool, value: Date}): null
    const { defaultValue = "", onDone: propOnDone = () => {} } = props

    const today = new Date()

    const splitDate = mdy => {
        const mm_dd_yyyy = mdy
            .split(/-|\//)
            .map(n => parseInt(n, 10))
            .filter(n => !isNaN(n))
        if (mm_dd_yyyy[2] < 100) {
            mm_dd_yyyy[2] += 2000
        }
        return mm_dd_yyyy
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
            year != date.getFullYear() ||
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
        document.addEventListener("click", onNonDatepickerClick)
        return () => {
            document.removeEventListener("click", onNonDatepickerClick)
        }
    }, [textDate, datePickerOpen])

    const onInputChange = e => {
        const { value } = e.target
        if ((value.length === 8 || value.length === 10) && !isMdyValid(value)) {
            setError("Please enter a valid date")
        } else {
            setError(null)
        }
        setTextDate(value)
    }
    const onDatePickerChange = date => {
        setError(null)
        setTextDate(dateToMdy(date))
    }

    const datePickerButtonOnClick = (textDate, datePickerOpen) => {
        blurDateInput(textDate, datePickerOpen ? null : true)
        setDatePickerOpen(!datePickerOpen)
    }
    const blurDateInput = (textDate, valid) => {
        if (valid == null) {
            valid = isMdyValid(textDate)
        }
        if (!valid) {
            setError("Please enter a valid date")
        }
        propOnDone({ valid, value: mdyToDate(textDate) })
    }
    return (
        <div ref={parentEl}>
            <div className={classes.dateInputWrapper}>
                <span className={classes.inputContainer}>
                    <input
                        aria-label="Date Input"
                        className={classes.dateInput}
                        type="text"
                        maxLength="10"
                        required
                        value={textDate}
                        onChange={onInputChange}
                        onBlur={e => blurDateInput(e.target.value)}
                        placeholder="mm/dd/yyyy"
                    />
                    <button
                        className={classes.datePickerButton}
                        onClick={() => datePickerButtonOnClick(textDate, datePickerOpen)}
                    >
                        <SvgCalendar />
                    </button>
                </span>
                <span className={classes.errorText}>{error}</span>
            </div>
            <Calendar
                className={classes.datePicker}
                tileClassName={[classes.datePickerTile, classes.datePickerPart]}
                value={isMdyValid(textDate) ? mdyToDate(textDate) : today}
                onChange={onDatePickerChange}
            />
        </div>
    )
}

const useStyles = createUseStyles({
    dateInputWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    inputContainer: props => ({
        display: "flex",
        justifyContent: "space-between",
        border: `.1rem solid ${props.error ? "red" : "#d4d5d6"}`,
        borderRadius: ".5rem",
        backgroundColor: "#d4d5d6",
        padding: "0.7rem",
        width: "100%",
    }),
    dateInput: {
        backgroundColor: "inherit",
        border: "none",
        outline: "none",
    },
    datePicker: props => ({
        display: props.datePickerOpen ? "initial" : "none",
        position: "absolute",
        overflow: "hidden",
        padding: "0.3rem",
        transform: "translatex(-0.8rem)",
        borderRadius: ".5rem",
        boxShadow: "0rem 0rem 0.6rem #b4b5b6",
        backgroundColor: "#fcfdff",
        "@supports (backdrop-filter: blur(6rem))": {
            backdropFilter: "blur(6rem)",
            background: "#fcfdff00",
        },
    }),
    datePickerTile: {
        borderRadius: "0.5rem",
    },
    datePickerButton: {
        background: "none",
        border: "none",
        cursor: "pointer",
        height: "1.5rem",
        width: "1.5rem",
        transition: "background-color 150ms",
        borderRadius: "50%",
        "&:hover": {
            backgroundColor: "#b4b5b6",
        },
    },
    errorText: {
        color: "red",
    },
    datePickerPart: {},
})

export default ElectionDateInput
