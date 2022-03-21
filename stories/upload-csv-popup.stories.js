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

// todo
/* export const WithFile = Template.bind({})
 * WithFile.play = async ({ canvasElement }) => {
 *     const canvas = within(canvasElement)
 *     const file = new File(['hello world'], 'hello.csv')
 *
 *     await userEvent.upload(canvas.getByTestId('file-drop'), file)
 * } */
