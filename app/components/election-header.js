// https://github.com/EnCiv/undebate-ssp/issues/18
"use-strict";

import React from "react";
import SvgBookOpen from '../svgr/book-open'
import SvgChevronLeft from '../svgr/chevron-left'
import SvgHome from '../svgr/home'
import { createUseStyles } from "react-jss";

const ElectionHeader = (props) => {
  const classes = useStyles();
  const {
    defaultValue = 0,
    elections = [],
    onDone = () => {},
  } = props;

  return (
    <div className={classes.electionHeader}>
      <div>
        <SvgChevronLeft />
        <SvgHome />
      </div>
      <select className={classes.electionSelect}>
        {elections.map(element => <option>{element}</option>)}
      </select>
      <div>
        <SvgBookOpen />
      </div>
    </div>
  );
};

export default ElectionHeader;

const useStyles = createUseStyles({
  electionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "1.25rem 2.5rem",
  },
  electionSelect: {
    border: "none",
    fontWeight: "bold",
    "&:hover": {
      cursor: "pointer",
    }
  }
});