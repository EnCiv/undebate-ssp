// https://github.com/EnCiv/undebate-ssp/issues/18
"use-strict";

import React from "react";
import SvgHome from '../svgr/home'
import { createUseStyles } from "react-jss";

const ElectionHeader = (props) => {
    // const classes = useStyles();
  
    return (
      <div>
          <SvgHome />
          Election Header Select
      </div>
    );
};

export default ElectionHeader;