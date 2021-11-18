import React from "react";

import { Submit } from "../app/components/submit";

export default {
  title: "Submit",
  component: Submit,
  argTypes: {
    onDone: {
      action: "submitted",
    },
  },
};

const Template = (args) => <Submit {...args} />;

export const SubmitTest = Template.bind({});

SubmitTest.args = {};
