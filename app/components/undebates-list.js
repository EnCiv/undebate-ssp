// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import cx from 'classnames'

import { useTable } from 'react-table'

function Table({ columns, data, onRowClicked }) {
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    })

    // Render the UI for your table
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
        debugger
        onDone({ value: row.original._id, valid: true })
    }

    // Not sure if this is proper use of useMemo for "data"
    const data = React.useMemo(() => electionObjs, [])
    // Eventually need to do electionOMs.map()....right now only doing one.
    const electionOMs = React.useMemo(
        () => electionObjs.map(obj => [obj, getElectionStatusMethods(null, obj)]),
        [electionObjs]
    )
    const [electionObj, electionMethods] = electionOMs[0]
    const electionDates = () => {
        const createDate = moment(ObjectID(electionObj._id).getDate())
        const formattedCreateDate = createDate.format('DD.MM.YY')
        const endDate = moment(new Date(electionObj.electionDate))
        // const endDate = moment(electionObjs[0].electionDate).getDate());
        const formattedEndDate = endDate.format('DD.MM.YY')
        return `${formattedCreateDate} - ${formattedEndDate}`
    }

    const moderatorStatus = () => {
        if (electionMethods.checkTimelineCompleted() && electionMethods.getScriptStatus() !== 'completed') {
            return 'Script pending'
        } else {
            return 'Script not completed'
        }
    }

    const candidates = () => {
        return ''
    }

    const status = () => {
        return ''
    }

    // Do I make accessor for table elements calls to electionMethods???
    const columns = React.useMemo(
        () => [
            {
                Header: 'Election Name',
                accessor: 'electionName',
            },
            {
                Header: 'Date',
                accessor: electionDates,
            },
            {
                Header: 'Moderator',
                accessor: moderatorStatus,
            },
            {
                Header: 'Candidates',
                accessor: candidates,
            },
            {
                Header: 'Status',
                accessor: status,
            },
        ],
        []
    )

    return (
        // <Styles>
        <Table columns={columns} data={data} onRowClicked={onRowClicked} />
        // </Styles>
    )
}
// Temp placeholder CSS styling ... will need to change to match FIGMA reqs for UndebatesList
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

        // th,
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
