// From issue: https://github.com/EnCiv/undebate-ssp/issues/7
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import ElectionDateInput from '../app/components/election-date-input'

export default {
    title: 'Election Date Input',
    component: ElectionDateInput,
}

const useStyles = createUseStyles({
    dateInput: { width: '15rem' },
})

const Template = (args, context) => {
    const { electionOM, onDone } = context
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return (
        <div className={useStyles().dateInput}>
            <ElectionDateInput
                {...args}
                defaultValue={electionObj.electionDateStory}
                onDone={({ valid, value }) => {
                    electionMethods.upsert({ electionDateStory: value })
                    onDone({ valid, value })
                }}
            />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {}

export const WithDefaultValue = Template.bind({})
WithDefaultValue.args = {
    defaultElectionObj: {
        electionDateStory: '11/12/2022',
    },
}
