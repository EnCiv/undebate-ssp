"use strict";

// From issue: https://github.com/EnCiv/undebate-ssp/issues/7

import React, { useState } from "react";

import { createUseStyles } from "react-jss";
import ElectionDateInput from "../app/components/election_date_input";

export default {
  title: "Election Date Input",
  component: ElectionDateInput,
};

const useStyles = createUseStyles({
  dateInput: { width: "15rem" },
});

const Template = (args) => {
  const [changeMessage, setChangeMessage] = useState("");
  const [doneMessage, setDoneMessage] = useState("");

  return (
    <div className={useStyles().dateInput}>
      <ElectionDateInput
        {...args}
        onChange={(u) => setChangeMessage(u.toString().substring(0, 15))}
        onDone={(u) => setDoneMessage(u.toString().substring(0, 15))}
      />
      onChange Value: {changeMessage}
      <br />
      onDone Value: {doneMessage}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = { defaultValue: "11/10/2021" };
