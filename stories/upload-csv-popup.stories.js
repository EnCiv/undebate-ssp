// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useEffect } from 'react'
import { within, userEvent } from '@storybook/testing-library'
import UploadCSVPopup from '../app/components/upload-csv-popup'

export default {
    title: 'Upload CSV Popup',
    component: UploadCSVPopup,
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultValue, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert({ candidates: defaultValue }), [defaultValue])

    return (
        <UploadCSVPopup
            visible='true'
            electionObj={electionObj}
            electionMethods={electionMethods}
            closePopup={() => console.log('close popup called')}
            {...otherArgs}
        />
    )
}

// todo fix unique key error on load of storybook
export const Default = Template.bind({})

// todo (maybe copy this into Upload CSV stories in addition to this, to test popup close)
export const EmptyTableNoUniqueIds = Template.bind({})
EmptyTableNoUniqueIds.args = { defaultValue: {} }
EmptyTableNoUniqueIds.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    setTimeout(async () => {
        await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)

        setTimeout(async () => {
            await userEvent.click(canvas.getByText('Extract Data'))
        }, 1000)
    }, 1000)
}

export const EmptyTableWithUniqueIds = Template.bind({})
EmptyTableWithUniqueIds.args = { defaultValue: {} }
EmptyTableWithUniqueIds.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    setTimeout(async () => {
        await userEvent.upload(canvas.getByTestId('file-select-input'), withUniqueIdsFile)

        setTimeout(async () => {
            await userEvent.click(canvas.getByText('Extract Data'))
        }, 1000)
    }, 1000)
}

export const WithLongFileName = Template.bind({})
WithLongFileName.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const file = new File(['hello world'], 'ThisIsARatherLongFileNameWithNoSpacesInIt.csv')

    setTimeout(async () => {
        await userEvent.upload(canvas.getByTestId('file-select-input'), file)
    }, 1000)
}

export const WithLongSpacesFile = Template.bind({})
WithLongSpacesFile.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const file = new File(['hello world'], 'This is a long file name with spaces.csv')

    setTimeout(async () => {
        await userEvent.upload(canvas.getByTestId('file-select-input'), file)
    }, 1000)
}

export const FileMissingHeaders = Template.bind({})
FileMissingHeaders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    setTimeout(async () => {
        await userEvent.upload(canvas.getByTestId('file-select-input'), missingHeaders)

        setTimeout(async () => {
            await userEvent.click(canvas.getByText('Extract Data'))
        }, 1000)
    }, 1000)
}

export const BadFileType = Template.bind({})
BadFileType.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const content = 'non text string'
    const file = new File([new Uint8Array(content.split('').map(char => char.charCodeAt(0)))], 'hello.png', {
        type: 'image/png',
    })

    setTimeout(async () => {
        await userEvent.upload(canvas.getByTestId('file-select-input'), file)

        setTimeout(async () => {
            await userEvent.click(canvas.getByText('Extract Data'))
        }, 1000)
    }, 1000)
}

const noUniqueIdsFile = new File(
    [
        `Name,Email,Office
Diana Russel,felicia.reid@example.com,Posuere sed
Jacob Jones,navaeh.simmons@example.com,Eu at`,
    ],
    'no unique ids.csv'
)

const withUniqueIdsFile = new File(
    [
        `UniqueId,Name,Email,Office
61e34ba4dd28d45f2c6c66be,Diana Russel,felicia.reid@example.com,Posuere sed
61e34bb17ad05c2b9003f600,Jacob Jones,navaeh.simmons@example.com,Eu at`,
    ],
    'with unique ids.csv'
)

const missingHeaders = new File(
    [
        `Diana Russel,felicia.reid@example.com,Posuere sed
Jacob Jones,navaeh.simmons@example.com,Eu at`,
    ],
    'missing headers.csv'
)
