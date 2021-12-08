// https://github.com/EnCiv/undebate-ssp/issues/22

import UndebatesHeaderBar from "../app/components/undebates-header-bar"

export default {
    title: "Undebates Header Bar",
    component: UndebatesHeaderBar,
}

const Template = args => (
    <div style={{ background: "#E9EAEB", width: "100%" }}>
        <UndebatesHeaderBar {...args} />
    </div>
)

export const Default = Template.bind({})
Default.args = { userId: "someone@example.com" }
