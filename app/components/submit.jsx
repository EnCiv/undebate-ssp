"use-strict";

import React from "react";
import { createUseStyles } from "react-jss";

export const Submit = ({ onDone }) => {
  const classes = useStyles();

  return (
    <button
      className={classes.button}
      onClick={() => {
        onDone(true);
      }}
    >
      Submit
    </button>
  );
};

const useStyles = createUseStyles({
  button: {
    borderRadius: "30px",
    backgroundColor: "#7470FF",
    border: "none",
    color: "#FFF",
    padding: ".9em 1.3em",
    fontWeight: 600,
  },
});
