// https://github.com/EnCiv/undebate-ssp/issues/9

import ElectionTextInput from "../app/components/election-text-input";

export default {
  title: "Election Text Input",
  component: ElectionTextInput,
};

const Template = (args) => (
  <div style={{ width: "50%" }}>
    <ElectionTextInput name="Input Name" {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  name: "Input Name",
  defaultValue: "",
  checkIsEmail: false,
};

export const DefaultValueSet = Template.bind({});
DefaultValueSet.args = {
  name: "Input Name",
  defaultValue: "Default value",
  checkIsEmail: false,
};

export const EmailValidation = (args) => (
  <form onSubmit={(e) => e.preventDefault()} style={{ width: "50%" }}>
    <ElectionTextInput {...args} />
    <input type="submit" style={{ marginTop: "1rem" }} />
  </form>
);
EmailValidation.args = {
  name: "Email Address",
  defaultValue: "",
  checkIsEmail: true,
};
