// https://github.com/EnCiv/undebate-ssp/issues/55
import React, { useEffect } from 'react'
import { expect } from '@storybook/jest'
import { within, userEvent, waitFor } from '@storybook/testing-library'
import { getElectionCandidates } from './story-helpers'
import PasteGoogleSheetsLink from '../app/components/paste-google-sheets-link'

export default {
    title: 'Paste Google Sheets Link',
    component: PasteGoogleSheetsLink,
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultValue, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert(defaultValue), [defaultValue])

    return <PasteGoogleSheetsLink electionOM={electionOM} {...otherArgs} />
}

export const Default = Template.bind({})
Default.args = { defaultValue: {} }

export const Clicked = Template.bind({})
Clicked.args = { defaultValue: {} }
Clicked.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByTestId('paste-sheets-button'))
}
