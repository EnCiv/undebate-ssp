import React from "react";

import { SectionHeader } from "../app/components/section_header";
import { createUseStyles } from "react-jss";

export default {
  title: "Section Header",
  component: SectionHeader,
  argTypes: {},
};

const useStyles = createUseStyles({
  section: {
    width: "20rem",
  },
});
const Template = (args) => (
  <SectionHeader
    className={useStyles().section}
    name="Configuration"
    {...args}
  />
);

export const SectionHeaderTest = Template.bind({});

SectionHeaderTest.args = {};
