// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useEffect } from 'react'
import { expect } from '@storybook/jest'
import { within, userEvent, waitFor } from '@storybook/testing-library'
import { getElectionCandidates } from './story-helpers'
import UploadCSVPopup from '../app/components/upload-csv-popup'
import makeChapter from './make-chapter'

const mC = makeChapter(UploadCSVPopup)

export default {
    title: 'Upload CSV Popup',
    component: UploadCSVPopup,
    decorators: [
        Story => (
            <div>
                There is a defect with storybook interactions that causes the select file dialog to show up when the
                interactions upload a file to the input. The story still works, but you will have to press escape or
                click cancel to close the dialog and see the rest of the story. See this issue on github see if they
                have fixed this yet:
                <br />
                <a href='https://github.com/storybookjs/storybook/issues/17882'>
                    https://github.com/storybookjs/storybook/issues/17882
                </a>
                <Story />
            </div>
        ),
    ],
}

const noUniqueIdsFile = new File(
    [
        `Name,Email,Office
Diana Russel,my.new.email@example.com,New Office
John Smith,john.smith@example.com,Foo bar`,
    ],
    'no unique ids.csv'
)

const withUniqueIdsFile = new File(
    [
        `UniqueId,Name,Email,Office
61e34ba4dd28d45f2c6c66be,Diana Russel,my.new.email@example.com,New Office
61e34bb17ad05c2b9003f600,Jacob Jones,navaeh.simmons@example.com,Eu at`,
    ],
    'with unique ids.csv'
)

const missingHeaders = new File(
    [
        `Diana Russel,my.new.email@example.com,New Office
Jacob Jones,navaeh.simmons@example.com,Eu at`,
    ],
    'missing headers.csv'
)

const allNewDataFile = new File(
    [
        `Name,Email,Office
Madina Penn,madina.penn@random.com,Random Office
Leja Arroyo,leja.arroyo@random.com,Random Office`,
    ],
    'all new data file.csv'
)

const otherDataFile = new File(
    [
        `Ballot Name,Office,Slate,Email Address,Type,unique_id,recorder_url,recorder_url_updated,viewer_url,viewer_url_updated
Breeze Velazquez,Academic Affairs Commission,For the People,breezey06@fake.enciv.org,candidate,5e99f99a4cc6803ba8c1864f,,,,
Alice Naland,Campus Events Commission,Independent,alicenaland@fake.enciv.org,candidate,5e99f99a4cc6803ba8c18651,,,,`,
    ],
    'other data file.csv'
)

const existingTableOldEmailArgs = {
    candidates: {
        '61e34ba4dd28d45f2c6c66be': {
            uniqueId: '61e34ba4dd28d45f2c6c66be',
            name: 'Diana Russel',
            email: 'my.old.email@example.com',
            office: 'old office',
        },
    },
}

const existingTableNewEmailArgs = {
    candidates: {
        '61e34ba4dd28d45f2c6c66be': {
            uniqueId: '61e34ba4dd28d45f2c6c66be',
            name: 'Diana Russel',
            email: 'my.new.email@example.com',
            office: 'old office',
        },
    },
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

export const EmptyTableNoUniqueIds = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(0))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)
    // ensure button is enabled after file added:
    await waitFor(() => expect(canvas.getByText('Extract Data').getAttribute('disabled')).toBeNull())
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))

    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(2))
})

export const EmptyTableWithUniqueIds = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(0))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), withUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))

    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(2))
    await waitFor(() =>
        expect(getElectionCandidates(canvas)['61e34ba4dd28d45f2c6c66be'].email).toBe('my.new.email@example.com')
    )
    await waitFor(() =>
        expect(getElectionCandidates(canvas)['61e34bb17ad05c2b9003f600'].email).toBe('navaeh.simmons@example.com')
    )
})

export const ExistingTableWithUniqueIds = mC(
    { ...chapterTemplateArgs, defaultElectionObj: { ...existingTableOldEmailArgs } },
    async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(1))
        await new Promise(r => setTimeout(r, 1000))

        await userEvent.upload(canvas.getByTestId('file-select-input'), withUniqueIdsFile)
        await new Promise(r => setTimeout(r, 1000))

        await userEvent.click(canvas.getByText('Extract Data'))

        await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(2))
        await waitFor(() =>
            expect(getElectionCandidates(canvas)['61e34ba4dd28d45f2c6c66be'].email).toBe('my.new.email@example.com')
        )
        await waitFor(() =>
            expect(getElectionCandidates(canvas)['61e34bb17ad05c2b9003f600'].email).toBe('navaeh.simmons@example.com')
        )
    }
)

let testArgs = {
    ...chapterTemplateArgs,
    defaultElectionObj: {
        ...existingTableOldEmailArgs,
    },
}
testArgs.defaultElectionObj.candidates['61e34ba4dd28d45f2c6c66be'].office = 'New Office'
export const ExistingTableMatchEmail = mC(testArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(1))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))

    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(2))
    await waitFor(() =>
        expect(getElectionCandidates(canvas)['61e34ba4dd28d45f2c6c66be'].email).toBe('my.new.email@example.com')
    )
})

testArgs = {
    ...chapterTemplateArgs,
    defaultElectionObj: {
        ...existingTableOldEmailArgs,
    },
}
testArgs.defaultElectionObj.candidates['61e34ba4dd28d45f2c6c66be'].office = 'New Office'
export const ExistingTableMatchNameOffice = mC(testArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(1))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))

    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(2))
    await waitFor(() =>
        expect(getElectionCandidates(canvas)['61e34ba4dd28d45f2c6c66be'].email).toBe('my.new.email@example.com')
    )
})

export const ExistingTableNewData = mC(
    { ...chapterTemplateArgs, defaultElectionObj: { ...existingTableOldEmailArgs } },
    async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(1))
        await new Promise(r => setTimeout(r, 1000))

        await userEvent.upload(canvas.getByTestId('file-select-input'), allNewDataFile)
        await new Promise(r => setTimeout(r, 1000))

        await userEvent.click(canvas.getByText('Extract Data'))

        await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(3))
        await waitFor(() =>
            expect(getElectionCandidates(canvas)['61e34ba4dd28d45f2c6c66be'].email).toBe('my.old.email@example.com')
        )
    }
)

export const WithLongFileName = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))
    const file = new File(['hello world'], 'ThisIsARatherLongFileNameWithNoSpacesInIt.csv')

    await userEvent.upload(canvas.getByTestId('file-select-input'), file)
})

export const WithLongSpacesFile = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))
    const file = new File(['hello world'], 'This is a long file name with spaces.csv')

    await userEvent.upload(canvas.getByTestId('file-select-input'), file)
})

export const FileMissingHeaders = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), missingHeaders)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))

    await waitFor(() =>
        expect(canvas.getByTestId('upload-csv-error').textContent).toBe(
            "File is missing required headers. Please include 'name', 'email', and 'office'."
        )
    )
})

export const BadFileType = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))
    const content = 'non text string'
    const file = new File([new Uint8Array(content.split('').map(char => char.charCodeAt(0)))], 'hello.png', {
        type: 'image/png',
    })

    await userEvent.upload(canvas.getByTestId('file-select-input'), file)

    await userEvent.click(canvas.getByText('Extract Data'))

    await waitFor(() =>
        expect(canvas.getByTestId('upload-csv-error').textContent).toBe(
            'Unable to read file. Please confirm this is a csv file.'
        )
    )
})

export const UploadMultipleFiles = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(0))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(2))

    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), withUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(4))
})

export const OtherDataFileBadHeaders = mC(chapterTemplateArgs, async ({ canvasElement }) => {
    // test file given by David to ensure proper error messages
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), otherDataFile)

    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))

    await waitFor(() =>
        expect(canvas.getByTestId('upload-csv-error').textContent).toBe(
            "File is missing required headers. Please include 'name', 'email', and 'office'."
        )
    )
})
