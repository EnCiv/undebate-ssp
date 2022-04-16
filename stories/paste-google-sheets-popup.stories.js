// https://github.com/EnCiv/undebate-ssp/issues/55
import React, { useEffect } from 'react'
import { within, userEvent } from '@storybook/testing-library'
import PasteGoogleSheetsPopup from '../app/components/paste-google-sheets-popup'

export default {
    title: 'Paste Google Sheets Popup',
    component: PasteGoogleSheetsPopup,
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultValue, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert({ candidates: defaultValue }), [defaultValue])

    return (
        <PasteGoogleSheetsPopup
            visible='true'
            electionObj={electionObj}
            electionMethods={electionMethods}
            closePopup={() => console.log('close popup called')}
            {...otherArgs}
        />
    )
}

export const Default = Template.bind({})
