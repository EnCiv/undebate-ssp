// https://github.com/EnCiv/undebate-ssp/issues/54

import React, { useEffect } from 'react'
import UploadCSV from '../app/components/upload-csv'

export default {
    title: 'Upload CSV',
    component: UploadCSV,
}

const Template = (args, context) => {
    const { onDone, electionOM } = context
    const { defaultValue, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert(defaultValue), [defaultValue])

    return <UploadCSV electionOM={electionOM} {...otherArgs} onDone={onDone} />
}

export const Default = Template.bind({})
