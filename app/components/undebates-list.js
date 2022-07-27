// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useEffect, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import ObjectID from 'isomorphic-mongo-objectid'
import getElectionStatusMethods, {
    allCandidatesStatusTexts,
    allDateFilterOptions,
    allElectionStatusTexts,
    allModeratorStatusTexts,
    urgentModeratorStatuses,
} from '../lib/get-election-status-methods'
import CandidateStatusTable from './candidate-status-table'
import ElectionUrgentLiveFilters from './election-urgent-live-filters'
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
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table'

function daysBetweenDates(date1, date2) {
    const diffInTime = date2.getTime() - date1.getTime()
    return Math.floor(diffInTime / (1000 * 3600 * 24))
}

const DAYS_LEFT_DANGER = 3
function DefaultColumnFilterComponent({ column: { filterValue, preFilteredRows, setFilter } }) {
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
const defaultColumnFilterFunction = (rows, id, filterValue) => {
    return rows.filter(row => {
        if (typeof filterValue === 'string' || filterValue instanceof String) {
            return row.values[id] === filterValue
        } else if (filterValue instanceof Array) {
            if (filterValue.length) {
                return filterValue.includes(row.values[id])
            } else {
                return true
            }
        }
    })
}

function Table({ columns, data, preFilters, globalFilter, onRowClicked, classes }) {
    const defaultColumn = useMemo(
        () => ({
            Filter: DefaultColumnFilterComponent,
            filter: defaultColumnFilterFunction,
        }),
        []
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setFilter } = useTable(
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
                globalFilter: globalFilter,
            },
        },
        useFilters,
        useGlobalFilter,
        useSortBy
    )

    useEffect(() => {
        if (state.filters) {
            state.filters.forEach(filter => {
                // todo fix Column dropdown showing wrong value? (if still an issue after custom filter components)
                if (filter.id === 'Status' && filter.value === 'Live') {
                    setFilter('Status', [])
                } else if (filter.id === 'Moderator') {
                    setFilter('Moderator', [])
                }
            })
        }

        if (preFilters && Object.keys(preFilters).length) {
            setFilter(preFilters['column'], preFilters['value'])
        }
    }, [preFilters])

    // todo fix styling of sorting arrows
    // todo check arrow direction for sorts
    // todo use ChevronDown for filters, and flip it for when the filter is visible
    return (
        <table {...getTableProps()} className={classes.electionTable}>
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

function DateCell({ createDate, endDate, daysRemaining, isArchived = false }) {
    const classes = useStyles()

    const formatDate = date => {
        new Date().getDate()

        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${date.getFullYear().toString().slice(-2).padStart(2, '0')}`
    }

    const formattedCreateDate = formatDate(createDate)
    const formattedEndDate = endDate ? formatDate(endDate) : ''

    return (
        <div className={classes.dateCell}>
            <div className={classes.formattedDates}>
                {formattedCreateDate} - {formattedEndDate}
            </div>
            {isArchived ? '' : <div className={classes.secondaryText}>{getDaysText(daysRemaining)}</div>}
        </div>
    )
}

function IconCell({ className, Icon, text, textClassName, daysRemaining }) {
    const classes = useStyles()
    const daysText = getDaysText(daysRemaining)
    const dangerZone = daysRemaining >= 0 && daysRemaining <= DAYS_LEFT_DANGER

    return (
        <span className={cx(className, classes.iconCell)}>
            <div className={classes.iconContainer}>{Icon ? <Icon className={classes.iconCellIcon} /> : ''}</div>
            <div>
                <div className={classes[textClassName]}>{text}</div>
                <div className={dangerZone ? classes.dangerZoneDays : classes.secondaryText}>{daysText}</div>
            </div>
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
    const classes = useStyles()

    let Icon
    let textClass
    let shouldShowStatusTable = false
    switch (true) {
        case candidatesStatusText === undefined || candidatesStatusText === null || candidatesStatusText === '':
            break
        case candidatesStatusText === 'Election Table Pending...':
            Icon = ({ className }) => <ElectionGrid className={cx(className, classes.electionGridIcon)} />
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
            return <CandidateStatusTable className={classes.candidateStatusTable} statusObj={candidateStatuses} />
        }
    }

    return (
        <span className={classes.candidateCell}>
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
        allDateFilterOptions.forEach(status => {
            options.add(status)
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

function ModeratorFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        allModeratorStatusTexts.forEach(status => {
            options.add(status)
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
        // todo add icons to filter values
        allCandidatesStatusTexts.forEach(status => {
            options.add(status)
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
        allElectionStatusTexts.forEach(status => {
            options.add(status)
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

export default function UndebatesList({ className, style, electionObjs, globalFilter, onDone }) {
    const classes = useStyles()
    const [preFilters, setPreFilters] = useState({})

    const onRowClicked = (row, e) => {
        onDone({ value: row.original.id, valid: true })
    }

    const electionOMs = electionObjs.map(obj => [obj, getElectionStatusMethods(null, obj)])
    if (!electionOMs.length) return null

    const renderElectionNameCell = value => {
        // todo get office count here
        /* console.log(value) */
        const [obj, electionMethods] = electionOMs[value.row.index]
        let state = 'default'
        if (electionMethods.isElectionLive()) {
            state = 'Live'
        }
        if (electionMethods.isElectionUrgent()) {
            // todo create story for all candidates missed deadline
            // todo add candidates filter value for all missed deadline
            state = 'Urgent'
        }

        return <ElectionNameCell electionName={value.value} state={state} />
    }

    const getDateValue = (electionObj, rowIndex) => {
        return new Date(electionObj.electionDate)
    }

    const getModeratorValue = (electionObj, rowIndex) => {
        const [obj, electionMethods] = electionOMs[rowIndex]
        return electionMethods.getModeratorStatus()
    }

    const renderDateCell = value => {
        const [electionObj, electionMethods] = electionOMs[value.row.index]
        const daysRemaining = electionMethods.countDayLeft()
        const createDate = ObjectID(electionObj.id).getDate()
        const endDate = new Date(electionObj.electionDate)
        const isArchived = electionMethods.getElectionListStatus() === 'Archived'

        return (
            <DateCell createDate={createDate} endDate={endDate} daysRemaining={daysRemaining} isArchived={isArchived} />
        )
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

    const dateFilterFunction = (rows, columnIds, filterValue) => {
        const addMonths = (date, numMonths) => {
            return new Date(date.setMonth(date.getMonth() + numMonths))
        }
        // todo add story to storybook to display multiple election dates
        let filterStartDate = new Date()
        let filterEndDate = new Date()
        switch (filterValue) {
            case 'Last year':
                filterStartDate = addMonths(new Date(), -12)
                break
            case 'Last 6 months':
                filterStartDate = addMonths(new Date(), -6)
                break
            case 'Last month':
                filterStartDate = addMonths(new Date(), -1)
                break
            case 'Future':
                filterEndDate = null
                break
        }

        return rows.filter(
            row => row.values.Date >= filterStartDate && (filterEndDate ? row.values.Date <= filterEndDate : true)
        )
    }

    const candidatesFilterFunction = (rows, columnIds, filterValue) => {
        // todo handle "Completed" filter if added
        switch (filterValue) {
            case 'In Progress':
                return rows.filter(
                    row => !['-', 'Election Table Pending...', 'unknown'].includes(row.values.Candidates)
                )
            default:
                return rows.filter(row => row.values.Candidates === filterValue)
        }
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

    const filterElectionState = ({ value, valid }) => {
        if (valid) {
            if (value == 'Live') {
                setPreFilters({ column: 'Status', value: value })
            } else if (value == 'Urgent') {
                setPreFilters({ column: 'Moderator', value: urgentModeratorStatuses })
            } else {
                setPreFilters({})
            }
        }
    }

    const columns = [
        {
            Header: 'Election Name',
            accessor: 'electionName',
            Cell: renderElectionNameCell,
            disableFilters: true,
        },
        {
            Header: 'Date',
            accessor: getDateValue,
            Cell: renderDateCell,
            Filter: DateFilter,
            filter: dateFilterFunction,
            sortType: 'datetime',
            sortInverted: true,
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
            filter: candidatesFilterFunction,
        },
        {
            Header: 'Status',
            accessor: getStatusValue,
            Cell: renderStatusCell,
            disableSortBy: true,
            Filter: StatusFilter,
        },
    ]

    return (
        <div className={cx(className, classes.container)} style={style}>
            <ElectionUrgentLiveFilters onDone={filterElectionState} />
            <Table
                columns={columns}
                data={electionObjs}
                preFilters={preFilters}
                globalFilter={globalFilter}
                onRowClicked={onRowClicked}
                classes={classes}
            />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    electionTable: {
        borderSpacing: '0',
        width: '90%',
        height: '100%',
        '& $tr': {
            '&:first-child td:first-child, &:first-child $electionStateIndicator': {
                borderTopLeftRadius: '1rem',
            },
            '&:first-child td:last-child': {
                // note that this is getting cutoff for some reason. I couldn't figure out how to fix this
                borderTopRightRadius: '1rem',
            },
            '&:last-child td:first-child, &:last-child $electionStateIndicator': {
                borderBottomLeftRadius: '1rem',
            },
            '&:last-child td:last-child': {
                // note that this is getting cutoff for some reason. I couldn't figure out how to fix this
                borderBottomRightRadius: '1rem',
            },
        },
    },
    th: {
        fontWeight: '500',
        textAlign: 'left',
        paddingLeft: '2rem',
    },
    tr: {
        cursor: 'pointer',
        height: '6rem',
        padding: '1rem !important',
        backgroundColor: 'white',
        '&:hover': {
            background: theme.backgroundColorComponent,
        },
        '& td': {
            '&:first-child': {
                paddingLeft: '0',
            },
        },
    },
    archivedTr: {
        color: 'white',
        backgroundColor: theme.colorSecondary,
        '&:hover': {
            background: theme.backgroundColorComponent,
        },
        '& $statusCell svg path': {
            stroke: 'white',
        },
    },
    candidateCell: {
        display: 'flex',
    },
    td: {
        borderColor: theme.backgroundColorApp,
        borderStyle: 'solid',
        borderWidth: '0.5rem 0',
        height: '100%',
        paddingLeft: '2rem',
    },
    iconCell: {
        display: 'flex',
    },
    iconContainer: {
        display: 'flex',
        marginRight: '0.625rem',
        alignItems: 'center',
    },
    iconCellIcon: {
        height: '1.5rem',
        width: '1.5rem',
    },
    electionGridIcon: {
        borderRadius: '0.3rem',
        backgroundSize: '1rem 1rem',
        '& path': {
            fill: theme.colorGray,
        },
    },
    candidateStatusTable: {
        paddingLeft: '1rem',
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
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        fontWeight: '500',
        paddingLeft: '2rem',
    },
    electionStateFilters: {
        // todo fix styling of ElectionUrgentLiveFilters
    },
    electionStateIndicator: {
        width: '0.625rem',
        height: '100%',
        float: 'left',
    },
    stateUrgent: {
        backgroundColor: theme.colorWarning,
    },
    stateLive: {
        backgroundColor: theme.colorPrimary,
    },
}))
