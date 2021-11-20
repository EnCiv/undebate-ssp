// https://github.com/EnCiv/undebate-ssp/issues/18
"use-strict";

import React from "react";
import SvgBookOpen from '../svgr/book-open'
import SvgChevronDown from '../svgr/chevron-down'
import SvgChevronLeft from '../svgr/chevron-left'
import SvgHome from '../svgr/home'
import { createUseStyles } from "react-jss";

const ElectionHeader = (props) => {
    // const classes = useStyles();
  
    return (
      <div>
          <SvgChevronLeft />
          <SvgHome />
          Election Header Select
          <SvgChevronDown />
          <SvgBookOpen />
      </div>
    );
};

export default ElectionHeader;