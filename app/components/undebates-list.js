// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import cx from 'classnames'
import ArrowSvg from '../svgr/arrow'
import Accepted from '../svgr/accepted'
import Declined from '../svgr/declined'
import ElectionPaper from '../svgr/election-paper'
import ReminderSent from '../svgr/reminder-sent'
import VideoSubmitted from '../svgr/video-submitted'
import DeadlineMissed from '../svgr/deadline-missed'
import ElectionGrid from '../svgr/election-grid'
import ChevronDown from '../svgr/chevron-down'
import { useTable, useFilters, useSortBy } from 'react-table'

function Table({ columns, data, onRowClicked, classes }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: 'Date',
                        desc: false,
                    },
                ],
            },
        },
        useSortBy
    )

    // todo fix styling of arrows
    // todo check arrow direction for sorts
    // todo use ChevronDown for filters, and flip it for when the filter is visible
    // todo TableHeader component, receives column and classes
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
    const { electionObj, rowIndex } = value

    const createDate = moment(ObjectID(electionObj.id).getDate())
    const formattedCreateDate = createDate.format('DD.MM.YY')
    const endDate = moment(new Date(electionObj.electionDate))
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

function ModeratorCell({ value, electionOMs }) {
    const classes = useStyles()
    const { rowIndex } = value
    const [obj, electionMethods] = electionOMs[rowIndex]
    const moderatorStatus = electionMethods.getModeratorStatus()
    let Icon
    switch (moderatorStatus) {
        case 'Script Pending':
        // intentional fall through here
        case 'ScriptSent':
            Icon = ElectionPaper
            break
        case 'Invite Accepted':
            Icon = Accepted
            break
        case 'Invite Declined':
            Icon = Declined
            break
        case 'Reminder Sent':
            Icon = ReminderSent
            break
        case 'Video Submitted':
            Icon = VideoSubmitted
            break
        case 'Deadline Missed':
            Icon = DeadlineMissed
            break
    }

    return (
        <div>
            <Icon />
            <div>{moderatorStatus}</div>
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

    const getEntireRow = (electionObj, rowIndex) => {
        return { electionObj, rowIndex }
    }

    const getModeratorStatus = (electionObj, rowIndex) => {
        // todo use ElectionCategory
        // todo use dynamic classes from react table to handle the different "urgency" states
        const [obj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getModeratorStatus()
    }

    const getCandidatesStatus = (electionObj, rowIndex) => {
        // todo use ElectionCategory
        const [obj, electionMethods] = electionOMs[rowIndex]
        return ''
    }

    const getElectionStatus = (electionObj, rowIndex) => {
        // todo use ElectionCategory
        const [obj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getUndebateStatus()
    }

    const columns = useMemo(() => [
        {
            Header: 'Election Name',
            accessor: 'electionName',
            disableFilters: true,
        },
        {
            Header: 'Date',
            accessor: getEntireRow,
            Cell: DateCell,
        },
        {
            Header: 'Moderator',
            accessor: getEntireRow,
            Cell: value => <ModeratorCell value={value.value} electionOMs={electionOMs} />,
            disableSortBy: true,
        },
        {
            Header: 'Candidates',
            accessor: getCandidatesStatus,
            disableSortBy: true,
        },
        {
            Header: 'Status',
            accessor: getElectionStatus,
            disableSortBy: true,
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
