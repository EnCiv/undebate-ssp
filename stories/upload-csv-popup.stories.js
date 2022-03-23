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
    useEffect(() => defaultValue && electionMethods.upsert(defaultValue), [defaultValue])

    return <UploadCSVPopup visible='true' electionOM={electionOM} {...otherArgs} />
}

export const Default = Template.bind({})

export const WithFile = Template.bind({})
WithFile.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const file = new File(['hello world'], 'hello.csv')

    await userEvent.upload(canvas.getByTestId('file-select-input'), file)
}

export const WithLongFileName = Template.bind({})
WithLongFileName.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const file = new File(['hello world'], 'ThisIsARatherLongFileNameWithNoSpacesInIt.csv')

    await userEvent.upload(canvas.getByTestId('file-select-input'), file)
}

export const WithLongSpacesFile = Template.bind({})
WithLongSpacesFile.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const file = new File(['hello world'], 'This is a long file name with spaces.csv')

    await userEvent.upload(canvas.getByTestId('file-select-input'), file)
}

// todo
/* export const BadFileType = Template.bind({})
 * BadFileType.play = async ({ canvasElement }) => {
 *     const canvas = within(canvasElement)
 *     const file = new File(['hello'], 'hello.png', { type: 'image/png' })
 *
 *     await userEvent.upload(canvas.getByTestId('file-select-input'), file)
 *     await userEvent.click(canvas.getByText('Extract Data'))
 * } */

// todo
/* export const MultipleFiles = Template.bind({})
 * MultipleFiles.play = async ({ canvasElement }) => {
 *     const canvas = within(canvasElement)
 *     const files = [new File(['hello world'], 'hello.csv'), new File(['foo bar'], 'foobar.csv')]
 *
 *     await userEvent.upload(canvas.getByTestId('file-select-input'), files)
 * } */

// todo
/* export const HappyPathExport = Template.bind({})
 * HappyPathExport.play = async ({ canvasElement }) => {
 *     const canvas = within(canvasElement)
 *     const file = new File(['hello world'], 'happy path.csv')
 *
 *     await userEvent.upload(canvas.getByTestId('file-select-input'), file)
 *     await userEvent.click(canvas.getByText('Extract Data'))
 * } */
