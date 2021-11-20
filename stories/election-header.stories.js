// https://github.com/EnCiv/undebate-ssp/issues/18

import ElectionHeader from "../app/components/election-header";

export default {
    title: "Election Header",
    component: ElectionHeader,
  };

const Template = (args) => <ElectionHeader {...args} />;

export const ElectionHeaderTest = Template.bind({});
ElectionHeaderTest.args = {};

