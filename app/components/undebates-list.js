// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import cx from 'classnames'
import ArrowSvg from '../svgr/arrow'
import ChevronDown from '../svgr/chevron-down'

import { useTable, useSortBy } from 'react-table'

function Table({ columns, data, onRowClicked, classes }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    )
    console.log('classes', classes)

    // todo fix styling of arrows
    // todo check arrow direction for sorts
    // todo use ChevronDown for filters
    return (
        <table {...getTableProps()} className={classes.table}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                className={cx(classes.th, classes.secondaryText)}
                            >
                                <span>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <ArrowSvg style={{ transform: 'rotate(180deg)' }} />
                                        ) : (
                                            <ArrowSvg />
                                        )
                                    ) : (
                                        ''
                                    )}
                                </span>
                                {' ' + column.render('Header') + ' '}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr
                            className={classes.tr}
                            {...row.getRowProps({
                                onClick: e => onRowClicked && onRowClicked(row, e),
                            })}
                        >
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()} className={classes.td}>
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

function DateCell({ value }) {
    const classes = useStyles()
    const { originalRow, rowIndex } = value

    const createDate = moment(ObjectID(originalRow.id).getDate())
    const formattedCreateDate = createDate.format('DD.MM.YY')
    const endDate = moment(new Date(originalRow.electionDate))
    const formattedEndDate = endDate ? endDate.format('DD.MM.YY') : ''
    const today = moment()
    // todo change this to last update date
    const daysBetween = today.diff(createDate, 'days')

    return (
        <div>
            <div className={classes.formattedDates}>
                {formattedCreateDate} - {formattedEndDate}
            </div>
            <div className={classes.secondaryText}>Last Update - {daysBetween} Days Ago</div>
        </div>
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

    const getEntireRow = (originalRow, rowIndex) => {
        return { originalRow, rowIndex }
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
            accessor: getEntireRow,
            Cell: DateCell,
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

    return (
        <div className={classes.container}>
            <Table columns={columns} data={electionObjs} onRowClicked={onRowClicked} classes={classes} />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    table: {
        borderSpacing: '0',
        width: '90%',
    },
    th: {
        fontWeight: '500',
    },
    tr: {
        height: '6rem',
        padding: '1rem !important',
        backgroundColor: 'white',
        '&:hover': {
            background: theme.backgroundColorComponent,
        },
    },
    td: {
        borderColor: theme.backgroundColorApp,
        borderStyle: 'solid',
        borderWidth: '0.5rem 0',
        textAlign: 'center',
    },
    formattedDates: {
        fontWeight: '400',
    },
    secondaryText: {
        color: theme.colorText,
        opacity: theme.secondaryTextOpacity,
    },
}))
