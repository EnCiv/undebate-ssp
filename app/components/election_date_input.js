"use strict";

// From issue: https://github.com/EnCiv/undebate-ssp/issues/7

import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";

import { SvgCalendar } from "./lib/svg.js";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

export function ElectionDateInput(props) {
  // defaultValue: mm/dd/yyyy string or a Date object
  // onChange: (null | Date): null
  // onDone: (null | Date): null
  const {
    defaultValue = "",
    onChange: propOnChange = () => {},
    onDone: propOnDone = () => {},
  } = props;

  const today = new Date();

  const mdyToDate = (mdy) => {
    let [month, day, year] = mdy.split(/-|\//).map((n) => parseInt(n, 10));
    if (year < 100) {
      year += 2000;
    }
    return new Date(year, month - 1, day);
  };
  const dateToMdy = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const isInvalidDate = (date) => isNaN(date);

  const defaultDate =
    defaultValue instanceof Date ? dateToMdy(defaultValue) : defaultValue;

  const [textDate, setTextDate] = useState(defaultDate);
  const [error, setError] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState();

  useEffect(() => {
    propOnChange(mdyToDate(textDate));
  }, [textDate]);

  const classes = useStyles({
    ...props,
    error,
  });

  const onInputChange = (e) => {
    const value = e.target.value;
    if (value.length >= 8 && isInvalidDate(mdyToDate(value))) {
      setError("Please enter a valid date");
    } else {
      setError(null);
    }
    setTextDate(value);
  };
  const onDatePickerChange = (date) => {
    setError(null);
    setTextDate(dateToMdy(date));
  };

  const datePickerValue = () => {
    const date = mdyToDate(textDate);
    return isInvalidDate(date) ? today : date;
  };

  const datePickerButtonOnClick = () => {
    setDatePickerOpen(!datePickerOpen);
    if (!datePickerOpen) {
      dateInputOnBlur();
    }
  };
  const dateInputOnBlur = () => {
    propOnDone(mdyToDate(textDate));
  };

  return (
    <>
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
            onBlur={dateInputOnBlur}
            placeholder="mm/dd/yyyy"
          />
          <button
            className={classes.datePickerButton}
            onClick={datePickerButtonOnClick}
          >
            <SvgCalendar />
          </button>
        </span>
        {<span className={classes.errorText}>{error}</span>}
      </div>
      {datePickerOpen && (
        <Calendar
          className={classes.datePicker}
          tileClassName={classes.datePickerTile}
          value={datePickerValue()}
          onChange={onDatePickerChange}
        />
      )}
    </>
  );
}

const useStyles = createUseStyles({
  dateInputWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputContainer: (props) => ({
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
  datePicker: {
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
  },
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
});

export default ElectionDateInput;
