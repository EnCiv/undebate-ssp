"use strict";

// From issue: https://github.com/EnCiv/undebate-ssp/issues/7

import React from "react";

import { createUseStyles } from "react-jss";
import ElectionDateInput from "../app/components/election_date_input";

export default {
  title: "Election Date Input",
  component: ElectionDateInput,
};

const useStyles = createUseStyles({
  dateInput: { width: "15rem" },
});

const Template = (args) => (
  <div className={useStyles().dateInput}>
    <ElectionDateInput {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = { defaultValue: "10/10/2021" };

export const WithOnChange = Template.bind({});
WithOnChange.args = { onChange: (v) => console.error(v) };

export const WithOnDone = Template.bind({});
WithOnDone.args = { onDone: (v) => console.error(v) };
