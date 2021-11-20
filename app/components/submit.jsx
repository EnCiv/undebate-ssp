"use-strict";

// https://github.com/EnCiv/undebate-ssp/issues/14

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
    borderRadius: "1.875rem",
    backgroundColor: "#7470FF",
    border: "none",
    color: "#FFF",
    padding: ".9em 1.3em",
    fontWeight: 600,
    "&:hover": {
      cursor: "pointer",
    },
  },
});
