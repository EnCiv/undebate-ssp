// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useEffect } from 'react'
import { within, userEvent } from '@storybook/testing-library'
import UploadCSV from '../app/components/upload-csv'

export default {
    title: 'Upload CSV',
    component: UploadCSV,
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

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultValue, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert(defaultValue), [defaultValue])

    return <UploadCSV electionOM={electionOM} {...otherArgs} />
}

export const Default = Template.bind({})

export const Clicked = Template.bind({})
Clicked.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByTestId('upload-csv-button'))
}

export const SuccessfulExtractionAndClose = Template.bind({})
SuccessfulExtractionAndClose.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByTestId('upload-csv-button'))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))
}
