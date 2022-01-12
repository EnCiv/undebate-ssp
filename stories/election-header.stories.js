// https://github.com/EnCiv/undebate-ssp/issues/18

import React, { useState } from 'react'
import ElectionHeader from '../app/components/election-header'

export default {
    title: 'Election Header',
    component: ElectionHeader,
}

const Template = (args, context) => {
    const { onDone } = context
    return (
        <div>
            <ElectionHeader {...context} {...args} onDone={onDone} />
        </div>
    )
}

export const ElectionHeaderTest = Template.bind({})
ElectionHeaderTest.args = {
    defaultValue: 2,
    elections: ['District Attorney Election 1', 'District Attorney Election 2', 'District Attorney Election 3'],
}
