// https://github.com/EnCiv/undebate-ssp/issues/88
import React, { useEffect } from 'react'
import { within, userEvent } from '@storybook/testing-library'
import CandidateTable from '../app/components/candidate-table'

const noUniqueIdsFile = new File(
    [
        `Name,Email,Office
Diana Russel,my.new.email@example.com,New Office
John Smith,john.smith@example.com,Foo bar`,
    ],
    'no unique ids.csv'
)

export default {
    title: 'Candidate Table',
    component: CandidateTable,
}

const Template = (args, context) => {
    const { onDone, electionOM } = context
    const { defaultValue, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => defaultValue && electionMethods.upsert(defaultValue), [defaultValue])

    return <CandidateTable electionOM={electionOM} {...otherArgs} onDone={onDone} />
}

export const Default = Template.bind({})
Default.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates: {
            '61e34ba4dd28d45f2c6c66be': {
                name: 'Diana Russell',
                email: 'felicia.reid@example.com',
                office: 'Posuere sed',
                region: 'Fermentum massa',
                status: 'Send 12 days ago',
                uniqueId: '61e34ba4dd28d45f2c6c66be',
            },
            '61e34bb17ad05c2b9003f600': {
                name: 'Jacob Jones',
                email: 'nevaeh.simmons@example.com',
                office: 'Eu at',
                region: 'Amet sodales',
                status: 'Send 12 days ago',
                uniqueId: '61e34bb17ad05c2b9003f600',
            },
        },
    },
}

export const Empty = Template.bind({})
Empty.args = { name: 'Candidate Table' }

export const UploadCsvUsage = Template.bind({})
UploadCsvUsage.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates: {
            '61e34ba4dd28d45f2c6c66be': {
                name: 'Diana Russell',
                email: 'felicia.reid@example.com',
                office: 'Posuere sed',
                region: 'Fermentum massa',
                status: 'Send 12 days ago',
                uniqueId: '61e34ba4dd28d45f2c6c66be',
            },
            '61e34bb17ad05c2b9003f600': {
                name: 'Jacob Jones',
                email: 'nevaeh.simmons@example.com',
                office: 'Eu at',
                region: 'Amet sodales',
                status: 'Send 12 days ago',
                uniqueId: '61e34bb17ad05c2b9003f600',
            },
        },
    },
}
UploadCsvUsage.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByTestId('upload-csv-button'))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByText('Extract Data'))
}
