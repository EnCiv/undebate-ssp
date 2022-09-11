// https://github.com/EnCiv/undebate-ssp/issues/88
import React, { useEffect } from 'react'
import { expect } from '@storybook/jest'
import { within, userEvent, waitFor } from '@storybook/testing-library'
import { getElectionCandidates } from './story-helpers'
import CandidateTable from '../app/components/candidate-table'
import { merge } from 'lodash'

const noUniqueIdsFile = new File(
    [
        `Name,Email,Office
Cathy Gonzales,my.new.email@example.com,New Office
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

const candidates = {
    '61e34ba4dd28d45f2c6c66be': {
        name: 'Diana Russell',
        email: 'felicia.reid@example.com',
        office: 'Posuere sed',
        region: 'Fermentum massa',
        "invitations": [
            {
                "_id": "62196f00024e6143586ffc6c",
                "text": "text",
                "sentDate": "2022-02-10T00:50:16.802Z",
                "responseDate": "2022-02-10T00:50:16.802Z",
                "status": "Accepted"
            }
        ],
        uniqueId: '61e34ba4dd28d45f2c6c66be',
    },
    '61e34bb17ad05c2b9003f600': {
        name: 'Jacob Jones',
        email: 'nevaeh.simmons@example.com',
        office: 'Eu at',
        region: 'Amet sodales',
        "invitations": [
            {
                "_id": "63194dd4a02246a0f6b16e2c",
                "text": "text",
                "sentDate": "2022-08-10T00:50:16.802Z",
                "responseDate": "2022-02-10T00:50:16.802Z",
                "status": "Accepted"
            },
            {
                "_id": "63194dd4a02246a0f6b16e2c",
                "text": "text",
                "sentDate": "2022-09-10T00:50:16.802Z",
                "responseDate": "2022-02-10T00:50:16.802Z",
                "status": "Accepted"
            },
        ],
        uniqueId: '61e34bb17ad05c2b9003f600',
    },
}

export const Default = Template.bind({})
Default.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates,
    },
}

export const Empty = Template.bind({})
Empty.args = { name: 'Candidate Table' }

export const UploadCsvUsage = Template.bind({})
UploadCsvUsage.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates,
    },
}
UploadCsvUsage.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await new Promise(r => setTimeout(r, 1000))
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(2))

    await userEvent.click(canvas.getByTestId('upload-csv-button'))
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.upload(canvas.getByTestId('file-select-input'), noUniqueIdsFile)
    await new Promise(r => setTimeout(r, 1000))

    await userEvent.click(canvas.getByTestId('extract-csv-button'))
    await waitFor(() => expect(Object.values(getElectionCandidates(canvas)).length).toBe(4))
}

export const RemindersOne = Template.bind({})
RemindersOne.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates: merge({}, candidates, {
            '61e34bb17ad05c2b9003f600': {
                invitations: {
                    '62ffd924984136547c938843': {
                        _id: '62ffd924984136547c938843',
                        sendDate: '2022-08-19T18:41:46.501Z',
                    },
                },
            },
        }),
    },
}

export const RemindersTwo = Template.bind({})
RemindersTwo.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates: merge({}, candidates, {
            '61e34ba4dd28d45f2c6c66be': {
                invitations: {
                    '62ffe382568c0b58ec776024': {
                        _id: '62ffe382568c0b58ec776024',
                        sendDate: '2022-08-19T19:25:21.063Z',
                    },
                },
            },
            '61e34bb17ad05c2b9003f600': {
                invitations: {
                    '62ffd924984136547c938843': {
                        _id: '62ffd924984136547c938843',
                        sendDate: '2022-08-19T18:41:46.501Z',
                    },
                },
            },
        }),
    },
}

export const AllSubmitted = Template.bind({})
AllSubmitted.args = {
    name: 'Candidate Table',
    defaultValue: {
        candidates: merge({}, candidates, {
            '61e34ba4dd28d45f2c6c66be': {
                invitations: {
                    '62ffe382568c0b58ec776024': {
                        _id: '62ffe382568c0b58ec776024',
                        sendDate: '2022-08-19T19:25:21.063Z',
                    },
                },
                submissions: {
                    '62ffe575a77f57304ca0e15c': { _id: '62ffe575a77f57304ca0e15c' },
                },
            },
            '61e34bb17ad05c2b9003f600': {
                invitations: {
                    '62ffd924984136547c938843': {
                        _id: '62ffd924984136547c938843',
                        sendDate: '2022-08-19T18:41:46.501Z',
                    },
                },
                submissions: { '62ffe59a3b252f0fecfe67c1': { _id: '62ffe59a3b252f0fecfe67c1' } },
            },
        }),
    },
}
