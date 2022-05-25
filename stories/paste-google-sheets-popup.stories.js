// https://github.com/EnCiv/undebate-ssp/issues/55
import React, { useEffect } from 'react'
import { expect } from '@storybook/jest'
import { within, userEvent, waitFor } from '@storybook/testing-library'
import { getElectionCandidates } from './story-helpers'
import PasteGoogleSheetsPopup from '../app/components/paste-google-sheets-popup'
import makeChapter from './make-chapter'

const mC = makeChapter(PasteGoogleSheetsPopup)

export default {
    title: 'Paste Google Sheets Popup',
    component: PasteGoogleSheetsPopup,
    decorators: [
        Story => (
            <div>
                Because this component relies on actual routes and sockets, its actual functionality will not work in
                storybook.
                <Story />
            </div>
        ),
    ],
    argTypes: {},
}

const chapterTemplateArgs = {
    defaultElectionObj: { candidates: {} },
    visible: 'true',
    closePopup: () => console.log('close popup called'),
}

export const Default = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // ensure button is disabled by default:
    await waitFor(() => expect(canvas.getByText('Extract Data').getAttribute('disabled')).toBe(''))
})
