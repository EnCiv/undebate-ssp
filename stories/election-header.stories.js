// https://github.com/EnCiv/undebate-ssp/issues/18

import React, { useState } from 'react'
import ElectionHeader from '../app/components/election-header'

export default {
    title: 'Election Header',
    component: ElectionHeader,
}

const Template = args => {
    const { defaultValue } = args
    const [validity, setValidity] = useState({ valid: true, value: defaultValue })
    return (
        <div>
            <ElectionHeader {...args} onDone={v => setValidity(v)} />
            <p>Is valid: {validity.valid ? 'True' : 'False'}</p>
            <p>Value: {validity.value}</p>
        </div>
    )
}

export const ElectionHeaderTest = Template.bind({})
ElectionHeaderTest.args = {
    defaultValue: 2,
    elections: ['District Attorney Election 1', 'District Attorney Election 2', 'District Attorney Election 3'],
}
