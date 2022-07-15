// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import CandidateStatusTable from './candidate-status-table'
import cx from 'classnames'
import ArrowSvg from '../svgr/arrow'
import Accepted from '../svgr/accepted'
import Declined from '../svgr/declined'
import ElectionPaper from '../svgr/election-paper'
import ReminderSent from '../svgr/reminder-sent'
import VideoSubmitted from '../svgr/video-submitted'
import DeadlineMissed from '../svgr/deadline-missed'
import ElectionGrid from '../svgr/election-grid'
import ElectionCreated from '../svgr/election-created'
import ElectionLive from '../svgr/election-live'
import InProgress from '../svgr/election-in-progress'
import Container from '../svgr/container'
import InviteSent from '../svgr/sent'
import ChevronDown from '../svgr/chevron-down'
import { useTable, useFilters, useSortBy } from 'react-table'

const DAYS_LEFT_DANGER = 3
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function Table({ columns, data, onRowClicked, classes }) {
    const defaultColumn = useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    )
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: {
                sortBy: [
                    {
                        id: 'Date',
                        desc: false,
                    },
                ],
            },
        },
        useFilters,
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
                                <div>{column.canFilter ? column.render('Filter') : null}</div>
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
    // todo change this to last update date (needs new electionMethod)
    const daysBetween = today.diff(createDate, 'days')

    // todo styling
    return (
        <div>
            <div className={classes.formattedDates}>
                {formattedCreateDate} - {formattedEndDate}
            </div>
            <div className={classes.secondaryText}>Last Update - {daysBetween} Days Ago</div>
        </div>
    )
}

function IconCell({ Icon, text, textClassName, daysRemaining }) {
    const classes = useStyles()
    const daysText = getDaysText(daysRemaining)
    const dangerZone = daysRemaining >= 0 && daysRemaining <= DAYS_LEFT_DANGER

    // todo styling
    // todo create component for icon/text/days left - move daysText to that and danger
    return (
        <span className={classes.iconCell}>
            {Icon ? <Icon /> : ''}
            <div className={classes[textClassName]}>{text}</div>
            <div className={dangerZone ? classes.dangerZoneDays : classes.secondaryText}>{daysText}</div>
        </span>
    )
}

function ModeratorCell({ value, electionOMs }) {
    const { rowIndex } = value
    const [obj, electionMethods] = electionOMs[rowIndex]
    const moderatorStatus = electionMethods.getModeratorStatus()
    let daysRemaining = electionMethods.countDayLeft()
    let Icon
    let textClass
    switch (moderatorStatus) {
        case 'Script Pending...':
        // intentional fall through here since they share Icons
        case 'Script Sent':
            Icon = ElectionPaper
            break
        case 'Invite Accepted':
            Icon = Accepted
            break
        case 'Invite Declined':
            Icon = Declined
            textClass = 'moderatorCellDeclined'
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
        case '-':
            daysRemaining = null
            break
    }

    return <IconCell Icon={Icon} text={moderatorStatus} textClassName={textClass} daysRemaining={daysRemaining} />
}

function StatusCell({ statusText, electionOMs, rowIndex }) {
    /* console.log('value', value) */
    const [obj, electionMethods] = electionOMs[rowIndex]
    /* const statusText = electionMethods.getElectionListStatus() */
    let Icon
    let textClass = ''
    switch (statusText) {
        case 'Configuring':
            Icon = ElectionCreated
            break
        case 'In Progress':
            Icon = InProgress
            break
        case 'Live':
            Icon = ElectionLive
            textClass = 'statusCellLive'
            break
        case 'Archived':
            Icon = Container
            break
    }

    const daysRemaining = electionMethods.countDayLeft()
    return <IconCell Icon={Icon} text={statusText} textClassName={textClass} daysRemaining={daysRemaining} />
}

function StatusFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    console.log('options', options)

    return (
        <select value={filterValue} onChange={e => setFilter(e.target.value || undefined)}>
            <option value=''>All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

function CandidateCell({ value, electionOMs }) {
    // todo use NavigationPanel Submissions for candidates state
    const { rowIndex } = value
    const [obj, electionMethods] = electionOMs[rowIndex]
    const candidatesStatusText = electionMethods.getCandidatesStatus()
    let daysRemaining = electionMethods.countDayLeft()
    let Icon
    let textClass
    let shouldShowStatusTable = false
    switch (true) {
        case candidatesStatusText === 'Election Table Pending...':
            Icon = ElectionGrid
            break
        case candidatesStatusText === 'Invite Pending...':
            Icon = InviteSent
            break
        case candidatesStatusText.includes('Missed Deadline'):
            Icon = DeadlineMissed
            break
        case candidatesStatusText === undefined || candidatesStatusText === null || candidatesStatusText === '':
            break
        case candidatesStatusText === '-':
            daysRemaining = null
            break
        default:
            Icon = VideoSubmitted
            shouldShowStatusTable = true
            break
    }
    const candidateStatuses = electionMethods.getSubmissionsStatus()
    const renderStatusTable = () => {
        if (shouldShowStatusTable && candidateStatuses !== 'default') {
            return <CandidateStatusTable statusObj={candidateStatuses} />
        }
    }

    return (
        <span>
            <IconCell Icon={Icon} text={candidatesStatusText} textClassName={textClass} daysRemaining={daysRemaining} />
            {renderStatusTable()}
        </span>
    )
}

function getDaysText(daysRemaining) {
    if (daysRemaining === undefined || daysRemaining === null || daysRemaining == '') {
        return ''
    }
    let daysText
    if (daysRemaining > 0) {
        daysText = daysRemaining + ' days left'
    } else if (daysRemaining === 0) {
        daysText = 'Today'
    } else {
        daysText = daysRemaining * -1 + ' days ago'
    }
    return daysText
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

    const getStatusValue = (electionObj, rowIndex) => {
        const [obj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getElectionListStatus()
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
            /* filter: 'between', */
            canFilter: false,
        },
        {
            Header: 'Moderator',
            accessor: getEntireRow,
            Cell: value => <ModeratorCell value={value.value} electionOMs={electionOMs} />,
            disableSortBy: true,
            /* filter: 'equals', */
            canFilter: false,
        },
        {
            Header: 'Candidates',
            accessor: getEntireRow,
            Cell: value => <CandidateCell value={value.value} electionOMs={electionOMs} />,
            disableSortBy: true,
            /* filter: 'equals', */
            canFilter: false,
        },
        {
            Header: 'Status',
            accessor: getStatusValue,
            Cell: value => {
                return <StatusCell statusText={value.value} electionOMs={electionOMs} rowIndex={value.row.index} />
            },
            disableSortBy: true,
            /* Filter: StatusFilter, */
            filter: 'equals',
            /* canFilter: true, */
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
    dangerZoneDays: {
        color: theme.colorWarning,
    },
    statusCellLive: {
        fontWeight: '600',
        color: theme.colorSubmitted,
    },
    moderatorCellDeclined: {
        fontWeight: '600',
        color: theme.colorWarning,
    },
}))
