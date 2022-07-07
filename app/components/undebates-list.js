// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import cx from 'classnames'

import { useTable } from 'react-table'

function Table({ columns, data, onRowClicked }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    })

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr
                            {...row.getRowProps({
                                onClick: e => onRowClicked && onRowClicked(row, e),
                            })}
                        >
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default function UndebatesList({ className, style, electionObjs, onDone }) {
    const classes = useStyles()

    const onRowClicked = (row, e) => {
        onDone({ value: row.original.id, valid: true })
    }

    const electionOMs = React.useMemo(
        () => electionObjs.map(obj => [obj, getElectionStatusMethods(null, obj)]),
        [electionObjs]
    )
    if (!electionOMs.length) return null

    const getFormattedDate = (originalRow, rowIndex) => {
        const createDate = moment(ObjectID(originalRow.id).getDate())
        const formattedCreateDate = createDate.format('DD.MM.YY')
        const endDate = moment(new Date(originalRow.electionDate))
        const formattedEndDate = endDate.format('DD.MM.YY')
        return `${formattedCreateDate} - ${formattedEndDate}`
    }

    const getModeratorStatus = (originalRow, rowIndex) => {
        // todo use ElectionCategory
        const [electionObj, electionMethods] = electionOMs[rowIndex]
        if (electionMethods.checkTimelineCompleted() && electionMethods.getScriptStatus() !== 'completed') {
            return 'Script pending'
        } else {
            return 'Script not completed'
        }
    }

    const getCandidatesStatus = () => {
        // todo use ElectionCategory
        return ''
    }

    const getElectionStatus = (originalRow, rowIndex) => {
        // todo use ElectionCategory
        const [electionObj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getUndebateStatus()
    }

    const columns = useMemo(() => [
        {
            Header: 'Election Name',
            accessor: 'electionName',
        },
        {
            Header: 'Date',
            accessor: getFormattedDate,
        },
        {
            Header: 'Moderator',
            accessor: getModeratorStatus,
        },
        {
            Header: 'Candidates',
            accessor: getCandidatesStatus,
        },
        {
            Header: 'Status',
            accessor: getElectionStatus,
        },
    ])

    return <Table columns={columns} data={electionObjs} onRowClicked={onRowClicked} />
}

const useStyles = createUseStyles(theme => ({
    table: {
        borderSpacing: '0',
        border: '1px solid black',

        tr: {
            lastChild: {
                td: {
                    borderBottom: '0',
                },
            },
        },

        tr: {
            margin: '0',
            padding: '0.5rem',
            borderBottom: '1px solid black',
            borderRight: '1px solid black',

            lastChild: {
                borderRight: '0',
            },
        },
    },
}))
