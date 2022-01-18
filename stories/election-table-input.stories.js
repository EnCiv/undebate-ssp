// https://github.com/EnCiv/undebate-ssp/issues/9

import React from 'react'
import ElectionTableInput from '../app/components/election-table-input'

export default {
    title: 'Election Table Input',
    component: ElectionTableInput,
}

const Template = (args, context) => {
    const { onDone } = context
    return (
        <div style={{ width: '50%' }}>
            <ElectionTableInput onDone={onDone} {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    name: 'Candidate Table',
    defaultValue: '',
    editable: true,
}
