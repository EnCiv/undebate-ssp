// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useEffect } from 'react'
import { within, userEvent } from '@storybook/testing-library'
import UploadCSV from '../app/components/upload-csv'

export default {
    title: 'Upload CSV',
    component: UploadCSV,
    decorators: [
        Story => (
            <div style={{ marginLeft: '15rem' }}>
                {/* marginLeft so that popup doesn't move button to the right when clicked */}
                <Story />
            </div>
        ),
    ],
}

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

    await userEvent.click(canvas.getByRole('button'))
}
