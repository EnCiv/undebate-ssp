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
                        desc: false, // todo this seems to not be working correctly? fix this
                    },
                ],
            },
        },
        useFilters,
        useSortBy
    )

    // todo fix styling of sorting arrows
    // todo check arrow direction for sorts
    // todo use ChevronDown for filters, and flip it for when the filter is visible
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
                    const rowStatus = row.cells.find(cell => cell.column.Header == 'Status')?.value
                    const isRowArchived = rowStatus === 'Archived'
                    return (
                        <tr
                            className={isRowArchived ? cx(classes.tr, classes.archivedTr) : classes.tr}
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

function ElectionNameCell({ electionName, state }) {
    const classes = useStyles()

    return (
        <div className={classes.electionNameCell}>
            <div className={cx(classes.electionStateIndicator, classes['state' + state])} />
            <div className={classes.electionName}>{electionName}</div>
        </div>
    )
}

function DateCell({ electionObj }) {
    const classes = useStyles()

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

function IconCell({ className, Icon, text, textClassName, daysRemaining }) {
    const classes = useStyles()
    const daysText = getDaysText(daysRemaining)
    const dangerZone = daysRemaining >= 0 && daysRemaining <= DAYS_LEFT_DANGER

    // todo styling
    // todo create component for icon/text/days left - move daysText to that and danger
    return (
        <span className={cx(className, classes.iconCell)}>
            {Icon ? <Icon /> : ''}
            <div className={classes[textClassName]}>{text}</div>
            <div className={dangerZone ? classes.dangerZoneDays : classes.secondaryText}>{daysText}</div>
        </span>
    )
}

function ModeratorCell({ moderatorStatus, daysRemaining }) {
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

function CandidateCell({ candidatesStatusText, daysRemaining, candidateStatuses }) {
    let Icon
    let textClass
    let shouldShowStatusTable = false
    switch (true) {
        case candidatesStatusText === undefined || candidatesStatusText === null || candidatesStatusText === '':
            break
        case candidatesStatusText === 'Election Table Pending...':
            Icon = ElectionGrid
            break
        case candidatesStatusText === 'Invite Pending...':
            Icon = InviteSent
            break
        case candidatesStatusText.includes('Missed Deadline'):
            Icon = DeadlineMissed
            break
        case candidatesStatusText === '-':
            daysRemaining = null
            break
        default:
            Icon = VideoSubmitted
            shouldShowStatusTable = true
            break
    }
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

function StatusCell({ className, statusText, daysRemaining }) {
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

    return (
        <IconCell
            className={className}
            Icon={Icon}
            text={statusText}
            textClassName={textClass}
            daysRemaining={daysRemaining}
        />
    )
}

function DateFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    // todo fix issue where clicking filter causes sorting
    const options = React.useMemo(() => {
        const options = new Set()
        options.add('Last year')
        options.add('Last 6 months')
        options.add('Last month')
        return [...options.values()]
    }, [id, preFilteredRows])

    // todo make this filter work
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

function ModeratorFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

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

function CandidatesFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            // todo update
            /* if (row.values[id] === 'default') {
             *     options.add('other')
             * } else { */
            options.add(row.values[id])
            /* } */
        })
        return [...options.values()]
    }, [id, preFilteredRows])

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

function StatusFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

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

    const renderElectionNameCell = (electionObj, rowIndex) => {
        // todo get office count here
        // todo set state here
        const state = 'default'
        /* const state = 'Urgent' */
        return <ElectionNameCell electionName={electionObj.value} state={state} />
    }

    const getDateValue = (electionObj, rowIndex) => {
        return moment(new Date(electionObj.electionDate))
    }

    const getModeratorValue = (electionObj, rowIndex) => {
        const [obj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getModeratorStatus()
    }

    const renderModeratorCell = value => {
        const [obj, electionMethods] = electionOMs[value.row.index]
        let daysRemaining = electionMethods.countDayLeft()
        return <ModeratorCell moderatorStatus={value.value} daysRemaining={daysRemaining} />
    }

    const getCandidatesValue = (electionObj, rowIndex) => {
        const [obj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getCandidatesStatus()
    }

    const renderCandidatesCell = value => {
        const [obj, electionMethods] = electionOMs[value.row.index]
        let daysRemaining = electionMethods.countDayLeft()
        const candidateStatuses = electionMethods.getSubmissionsStatus()
        return (
            <CandidateCell
                candidatesStatusText={value.value}
                daysRemaining={daysRemaining}
                candidateStatuses={candidateStatuses}
            />
        )
    }

    const getStatusValue = (electionObj, rowIndex) => {
        const [obj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getElectionListStatus()
    }

    const renderStatusCell = value => {
        const [obj, electionMethods] = electionOMs[value.row.index]
        let daysRemaining = electionMethods.countDayLeft()
        return <StatusCell className={classes.statusCell} statusText={value.value} daysRemaining={daysRemaining} />
    }

    // todo add ElectionName cell to handle multiple offices per election
    const columns = useMemo(() => [
        {
            Header: 'Election Name',
            accessor: 'electionName',
            Cell: renderElectionNameCell,
            disableFilters: true,
        },
        {
            Header: 'Date',
            accessor: getDateValue,
            Cell: value => <DateCell electionObj={value.row.original} />,
            Filter: DateFilter,
            /* filter: 'between', */
        },
        {
            Header: 'Moderator',
            accessor: getModeratorValue,
            Cell: renderModeratorCell,
            disableSortBy: true,
            Filter: ModeratorFilter,
        },
        {
            Header: 'Candidates',
            accessor: getCandidatesValue,
            Cell: renderCandidatesCell,
            disableSortBy: true,
            Filter: CandidatesFilter,
        },
        {
            Header: 'Status',
            accessor: getStatusValue,
            Cell: renderStatusCell,
            disableSortBy: true,
            Filter: StatusFilter,
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
        cursor: 'pointer',
        height: '6rem',
        padding: '1rem !important',
        backgroundColor: 'white',
        '&:hover': {
            background: theme.backgroundColorComponent,
        },
    },
    archivedTr: {
        color: 'white',
        backgroundColor: theme.colorSecondary,
        '&:hover': {
            background: theme.backgroundColorComponent, // todo check hover color for archived/live elections
        },
        '& $statusCell svg path': {
            stroke: 'white',
        },
    },
    statusCell: {},
    td: {
        borderColor: theme.backgroundColorApp,
        borderStyle: 'solid',
        borderWidth: '0.5rem 0',
        textAlign: 'center',
        height: '100%',
    },
    formattedDates: {
        fontWeight: '400',
    },
    secondaryText: {
        color: theme.colorText,
        opacity: '0.5',
        '$archivedTr &': {
            color: 'white',
        },
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
    electionNameCell: {
        height: '100%',
    },
    electionName: {
        height: '100%',
        fontWeight: '500',
    },
    electionStateIndicator: {
        width: '0.625rem',
        height: '100%', // todo fix
        /* height: '6rem', */
        float: 'left',
    },
    stateUrgent: {
        backgroundColor: theme.colorWarning,
    },
    stateLive: {
        backgroundColor: theme.colorPrimary,
    },
}))
