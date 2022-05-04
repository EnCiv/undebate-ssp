// https://github.com/EnCiv/undebate-ssp/issues/55
import React, { useEffect } from 'react'
import { expect } from '@storybook/jest'
import { within, userEvent, waitFor } from '@storybook/testing-library'
import { getElectionCandidates } from './story-helpers'
import PasteGoogleSheetsPopup from '../app/components/paste-google-sheets-popup'
import makeChapter from './make-chapter'

const mC = makeChapter(PasteGoogleSheetsPopup)

const happyPathLink =
    'https://docs.google.com/spreadsheets/d/1K0qt8A25qTVocoVbzVPUEnMRVvEaiq0cE86WmqShRKI/edit?usp=sharing'

export default {
    title: 'Paste Google Sheets Popup',
    component: PasteGoogleSheetsPopup,
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

export const HappyPath = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))

    await waitFor(() => userEvent.type(canvas.getByTestId('sheets-link'), happyPathLink))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))
    // todo
})
