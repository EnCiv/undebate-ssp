import React from "react";

import { createUseStyles } from "react-jss";
import ElectionCategory from "../app/components/election_category.js";

// from issue: https://github.com/EnCiv/undebate-ssp/issues/5

export default {
  title: "Election Category",
  component: ElectionCategory,
};

const useStyles = createUseStyles({
  category: { background: "#d4d5d6", width: "12vw" },
});

const Template = (args) => (
  <ElectionCategory className={useStyles().category} {...args} />
);

export const InProgressElectionCategory = Template.bind({});
InProgressElectionCategory.args = {
  categoryName: "Test!",
  status: "in progress",
  daysLeft: 5,
  numCandidates: 10,
  numCandidatesRecorded: 9,
};

export const DoneElectionCategory = Template.bind({});
DoneElectionCategory.args = {
  categoryName: "Test!",
  status: "Done",
};
