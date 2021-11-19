"use strict";

// https://github.com/EnCiv/undebate-ssp/issues/9

import { useState, React } from "react";
import { createUseStyles } from "react-jss";

const ElectionTextInput = (props) => {
  const classes = useStyles();
  const { name = "", defaultValue = "", checkIsEmail = false } = props;
  const [text, setText] = useState(defaultValue);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className={classes.electionTextInput}>
      <label for={name} className={classes.label}>{name}</label>
      <input
        type={checkIsEmail ? "email" : "text"}
        className={classes.input}
        value={text}
        name={name}
        onChange={handleChange}
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
