// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'
import cx from 'classnames'

import { useTable } from 'react-table'

function Table({ columns, data }) {
    debugger
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
                        <tr {...row.getRowProps()}>
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

export default function UndebatesList({ className, style, electionObj, electionMethods, onDone }) {
    debugger
    const classes = useStyles()
    debugger
    // const [electionObj, electionMethods] = electionOM
    // Not sure if this is proper use of useMemo for "data"
    const data = React.useMemo(() => electionObj, [])

    const electionDates = () => {
        const createDate = moment(ObjectID(electionObj[0]._id).getDate())
        const formattedCreateDate = createDate.format('DD.MM.YY')
        debugger
        const endDate = moment(new Date(electionObj[0].electionDate))
        // const endDate = moment(electionObj[0].electionDate).getDate());
        const formattedEndDate = endDate.format('DD.MM.YY')
        return `${formattedCreateDate} - ${formattedEndDate}`
    }

    const moderatorStatus = () => {
        debugger
        if (electionMethods.checkTimelineCompleted() && electionMethods.getScriptStatus() !== 'completed') {
            return 'Script pending'
        } else {
            return 'Script not completed'
        }
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
            // {
            //   Header: 'Candidates',
            //   accessor:

            // },
            // {
            //   Header: 'Status',
            //   accessor:

            // },
        ],
        []
    )

    return (
        // <Styles>
        <Table columns={columns} data={data} />
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
