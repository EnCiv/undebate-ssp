"use strict";

// https://github.com/EnCiv/undebate-ssp/issues/9

import { useState, useRef, useEffect, React } from "react";
import { createUseStyles } from "react-jss";
import IsEmail from "isemail";

const ElectionTextInput = (props) => {
  const classes = useStyles();
  const {
    name = "",
    defaultValue = "",
    checkIsEmail = false,
    onDone = () => {},
  } = props;

  const [text, setText] = useState(defaultValue);
  const inputRef = useRef(null);

  // this allows initial defaultValue to be passed up as input if valid
  useEffect(() => {
    handleDone();
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") inputRef.current.blur();
  };

  const handleDone = (e) => {
    if (isTextValid()) {
      onDone({ valid: true, value: text });
      return;
    }
    onDone({ valid: false, value: text });
  };

  const isTextValid = () => {
    // minDomainAtoms opt force requires a two part domain name
    // ex: user@example.com
    // this can be removed to accept a one part domain name if needed
    // ex: user@example
    const isValidEmail = IsEmail.validate(text, { minDomainAtoms: 2 });

    if (!text || (checkIsEmail && !isValidEmail)) {
      return false;
    }
    return true;
  };

  return (
    <div className={classes.electionTextInput}>
      <label htmlFor={name} className={classes.label}>
        {name}
      </label>
      <input
        key={name + "input"}
        type={checkIsEmail ? "email" : "text"}
        className={classes.input}
        value={text}
        name={name}
        onChange={handleChange}
        onBlur={handleDone}
        onKeyPress={handleKeyPress}
        ref={inputRef}
      />
    </div>
  );
};

export default ElectionTextInput;

const useStyles = createUseStyles({
  electionTextInput: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.75rem",
  },
  label: {
    margin: "0 0.625rem",
    fontWeight: "600",
  },
  input: {
    borderRadius: "0.625rem",
    background:
      "linear-gradient(0deg, rgba(38, 45, 51, 0.2), rgba(38, 45, 51, 0.2)), #FFFFFF",
    padding: "1rem 1.25rem",
    border: "none",
    fontSize: "1.125rem",
    width: "100%",
  },
});
