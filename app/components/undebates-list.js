// https://github.com/EnCiv/undebate-ssp/issue/21
import React, { useState, useEffect, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import ObjectID from 'isomorphic-mongo-objectid'
import getElectionStatusMethods, {
    allCandidatesStatusTexts,
    allDateFilterOptions,
    allElectionStatusTexts,
    allModeratorStatusTexts,
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
import CheckMark from '../svgr/check-mark'
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table'

const DAYS_LEFT_DANGER = 3
function DefaultColumnFilterComponent() {
    return ''
}
const defaultColumnFilterFunction = (rows, id, filterValue) => {
    return rows.filter(row => {
        if ((typeof filterValue === 'string' || filterValue instanceof String) && filterValue.length) {
            return row.values[id] === filterValue
        } else if (filterValue instanceof Array) {
            if (filterValue.length) {
                return filterValue.includes(row.values[id])
            } else {
                return true
            }
        } else {
            return true
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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setFilter, setGlobalFilter } =
        useTable(
            {
                columns,
                data,
                defaultColumn,
                initialState: {
                    hiddenColumns: ['State'],
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
                if (filter.id === 'State') {
                    setFilter('State', [])
                }
            })
        }

        if (preFilters && Object.keys(preFilters).length) {
            setFilter(preFilters['column'], preFilters['value'])
        }
        setGlobalFilter(globalFilter)
    }, [preFilters, globalFilter])

    return (
        <table {...getTableProps()} className={classes.electionTable}>
            <thead className={classes.thead}>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th className={cx(classes.th, classes.secondaryText)}>
                                <div className={classes.thDiv}>
                                    <span
                                        className={classes.thContent}
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                    >
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <ArrowSvg
                                                    className={cx(classes.basicIcon, classes.sortIcon)}
                                                    style={{ transform: 'rotate(180deg)' }}
                                                />
                                            ) : (
                                                <ArrowSvg className={cx(classes.basicIcon, classes.sortIcon)} />
                                            )
                                        ) : (
                                            ''
                                        )}

                                        <span className={classes.headerText}>{column.render('Header')}</span>
                                    </span>
                                    <span className={classes.thContent}>
                                        {column.canFilter ? column.render('Filter') : null}
                                    </span>
                                </div>
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
                            className={
                                isRowArchived
                                    ? cx(classes.tr, classes.clickable, classes.archivedTr)
                                    : cx(classes.tr, classes.clickable)
                            }
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

function ElectionNameCell({ electionName, state, officeCount }) {
    const classes = useStyles()
    return (
        <div className={classes.electionNameCell}>
            <div className={cx(classes.electionStateIndicator, classes['state' + state])} />
            <div className={classes.electionName}>
                <div className={classes.electionNameText}>{electionName}</div>
                {officeCount && officeCount > 1 ? (
                    <div className={classes.secondaryText}>{officeCount} Offices</div>
                ) : (
                    ''
                )}
            </div>
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

function getIconFromText(text, classes) {
    let Icon
    switch (true) {
        case text === 'Script Pending...' || text === 'Script Sent':
            Icon = ElectionPaper
            break
        case text === 'Invite Accepted':
            Icon = Accepted
            break
        case text === 'Invite Declined':
            Icon = Declined
            break
        case text === 'Reminder Sent':
            Icon = ReminderSent
            break
        case text === 'Invite Sent' || text === 'Invite Pending...':
            Icon = InviteSent
            break
        case text === 'Video Submitted':
            Icon = VideoSubmitted
            break
        case text.includes('Missed Deadline') || text === 'Deadline Missed':
            Icon = DeadlineMissed
            break
        case text === 'Election Table Pending...':
            Icon = ({ className }) => (
                <ElectionGrid
                    className={className}
                    style={{
                        borderRadius: '0.3rem',
                        backgroundSize: '1rem 1rem',
                        '& path': {
                            fill: '#7d8084',
                        },
                    }}
                />
            )
            break
        case text === 'Configuring':
            Icon = ({ className }) => <ElectionCreated className={cx(className, classes.invertedIcon)} />
            break
        case text === 'In Progress':
            Icon = ({ className }) => <InProgress className={cx(className, classes.invertedIcon)} />
            break
        case text === 'Live':
            Icon = ElectionLive
            break
        case text === 'Archived':
            Icon = ({ className }) => <Container className={cx(className, classes.invertedIcon)} />
            break
        case text === '-' || text === 'unknown' || text === 'Clear':
            break
        default:
            Icon = VideoSubmitted
            break
    }
    return Icon
}

function isRedText(text) {
    const redStaticTexts = ['Invite Declined', 'Deadline Missed']
    const redPatternTexts = ['missed deadline']
    let isRed = false
    if (redStaticTexts.includes(text)) {
        isRed = true
    } else {
        redPatternTexts.forEach(pattern => {
            if (text.toLowerCase().includes(pattern)) {
                isRed = true
            }
        })
    }
    return isRed
}

function isPurpleText(text) {
    const purpleStaticTexts = ['Live']
    let isPurple = false
    if (purpleStaticTexts.includes(text)) {
        isPurple = true
    }
    return isPurple
}

function ModeratorCell({ moderatorStatus, daysRemaining }) {
    const classes = useStyles()
    const Icon = getIconFromText(moderatorStatus, classes)
    const textClass = isRedText(moderatorStatus) ? 'redText' : ''
    if (moderatorStatus === '-') {
        daysRemaining = null
    }

    return <IconCell Icon={Icon} text={moderatorStatus} textClassName={textClass} daysRemaining={daysRemaining} />
}

function CandidateCell({ candidatesStatusText, daysRemaining, candidateStatuses }) {
    const classes = useStyles()
    const Icon = getIconFromText(candidatesStatusText, classes)
    const textClass = isRedText(candidatesStatusText) ? 'redText' : ''
    let shouldShowStatusTable = false
    switch (true) {
        case candidatesStatusText === '-':
            daysRemaining = null
            break
        case ['Election Table Pending...', 'Invite Pending...'].includes(candidatesStatusText) ||
            candidatesStatusText.includes('Missed Deadline'):
            break
        default:
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
    const classes = useStyles()
    const Icon = getIconFromText(statusText, classes)
    let textClass = isPurpleText(statusText) ? 'liveText' : ''

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

function DropdownFilter({ values, selectedValues, onItemClick, includeIcon = false }) {
    const classes = useStyles()
    const [isDroppedDown, setIsDroppedDown] = useState(false)
    const dropdownRef = React.createRef()
    const dropdownIconRef = React.createRef()

    useEffect(() => {
        if (isDroppedDown) {
            const handleClick = e => {
                if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                    if (!dropdownIconRef || (dropdownIconRef.current && !dropdownIconRef.current.contains(e.target))) {
                        setIsDroppedDown(false)
                    }
                }
            }
            const handleEscapeKey = e => {
                if (e.key === 'Escape') {
                    setIsDroppedDown(false)
                }
            }

            document.addEventListener('mousedown', handleClick)
            document.addEventListener('keyup', handleEscapeKey)

            return () => {
                document.removeEventListener('mousedown', handleClick)
            }
        }
    }, [dropdownRef])

    // todo Select All option for multiselect?
    return (
        <>
            <span ref={dropdownIconRef} className={classes.flexCenter}>
                <ChevronDown
                    onClick={() => setIsDroppedDown(!isDroppedDown)}
                    className={cx(
                        classes.basicIcon,
                        classes.clickable,
                        classes.filterDropdown,
                        isDroppedDown ? classes.flipped : ''
                    )}
                />
            </span>
            {isDroppedDown ? (
                <div ref={dropdownRef} className={cx(classes.clickable, classes.dropdownFilter)}>
                    {['Clear'].concat(values).map(value => {
                        const Icon = getIconFromText(value, classes)
                        let isWhiteIcon = ['Configuring', 'In Progress', 'Archived'].includes(value)
                        return (
                            <div className={classes.dropdownItem} onClick={onItemClick}>
                                <span
                                    className={cx(
                                        classes.flexCenter,
                                        isRedText(value) ? classes.redText : isPurpleText(value) ? classes.liveText : ''
                                    )}
                                >
                                    {includeIcon && Icon ? (
                                        <Icon
                                            className={cx(
                                                classes.basicIcon,
                                                classes.filterIcon,
                                                isWhiteIcon ? classes.whiteIcon : ''
                                            )}
                                        />
                                    ) : (
                                        ''
                                    )}
                                    {value}
                                </span>
                                <CheckMark
                                    className={classes.dropdownCheck}
                                    style={{ visibility: selectedValues[value] ? 'visible' : 'hidden' }}
                                />
                            </div>
                        )
                    })}
                </div>
            ) : (
                ''
            )}
        </>
    )
}

function SingleselectFilter({ values, onSetFilter }) {
    const [selectedValue, setSelectedValue] = useState('')

    useEffect(() => {
        onSetFilter(selectedValue)
    }, [selectedValue])

    const clickValue = event => {
        const value = event.target.textContent
        if (value === 'Clear') {
            setSelectedValue('')
        } else {
            setSelectedValue(value)
        }
    }

    return <DropdownFilter values={values} selectedValues={{ [selectedValue]: true }} onItemClick={clickValue} />
}

function MultiselectFilter({ values, onSetFilter }) {
    const [selectedValues, setSelectedValues] = useState({})

    useEffect(() => {
        values.forEach(value => (selectedValues[value] = false))
    }, [])

    useEffect(() => {
        onSetFilter(Object.keys(selectedValues).filter(key => selectedValues[key]))
    }, [selectedValues])

    const clickValue = event => {
        const value = event.target.textContent
        const updated = {}
        if (value === 'Clear') {
            values.forEach(value => (updated[value] = false))
            setSelectedValues(current => ({ ...current, ...updated }))
        } else {
            updated[value] = !selectedValues[value]
            setSelectedValues(current => ({ ...current, ...updated }))
        }
    }

    return (
        <DropdownFilter values={values} selectedValues={selectedValues} onItemClick={clickValue} includeIcon={true} />
    )
}

function DateFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        allDateFilterOptions.forEach(status => {
            options.add(status)
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return <SingleselectFilter values={options} onSetFilter={values => setFilter(values)} />
}

function ModeratorFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        allModeratorStatusTexts.forEach(status => {
            options.add(status)
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return <MultiselectFilter values={options} onSetFilter={values => setFilter(values)} />
}

function CandidatesFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        allCandidatesStatusTexts.forEach(status => {
            options.add(status)
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return <MultiselectFilter values={options} onSetFilter={values => setFilter(values)} />
}

function StatusFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
    const options = React.useMemo(() => {
        const options = new Set()
        allElectionStatusTexts.forEach(status => {
            options.add(status)
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return <MultiselectFilter values={options} onSetFilter={values => setFilter(values)} />
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

    const getElectionState = electionMethods => {
        let state = 'default'
        if (electionMethods.isElectionLive()) {
            state = 'Live'
        }
        if (electionMethods.isElectionUrgent()) {
            state = 'Urgent'
        }
        return state
    }

    const renderElectionNameCell = value => {
        const [obj, electionMethods] = electionOMs[value.row.index]
        const state = getElectionState(electionMethods)
        const electionOfficeCount = electionMethods.getElectionOfficeCount()

        return <ElectionNameCell electionName={value.value} state={state} officeCount={electionOfficeCount} />
    }

    const getStateValue = (electionObj, rowIndex) => {
        const [obj, electionMethods] = electionOMs[rowIndex]
        return getElectionState(electionMethods)
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
        const daysRemaining = electionMethods.getModeratorStatusDaysRemaining()
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
        if (!filterValue || (filterValue && !filterValue.length)) {
            return rows
        }
        const addMonths = (date, numMonths) => {
            return new Date(date.setMonth(date.getMonth() + numMonths))
        }
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
        if (filterValue && !filterValue.length) {
            return rows
        }
        let filteredRows = []
        // todo handle "Completed" filter if added
        filterValue.forEach(filter => {
            switch (filter) {
                case 'In Progress':
                    filteredRows = filteredRows.concat(
                        rows.filter(
                            row =>
                                !['-', 'Election Table Pending...', 'unknown'].includes(row.values.Candidates) &&
                                !row.values.Candidates.match(/Missed Deadline$/g)
                        )
                    )
                    break
                case 'Missed Deadline':
                    filteredRows = filteredRows.concat(
                        rows.filter(row => row.values.Candidates.match(/.*Missed Deadline$/g))
                    )
                    break
                default:
                    filteredRows = filteredRows.concat(rows.filter(row => row.values.Candidates === filter))
                    break
            }
        })
        return filteredRows
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
            setPreFilters({ column: 'State', value: value })
        }
    }

    const columns = [
        {
            Header: 'State',
            accessor: getStateValue,
            disableFilters: true,
        },
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
            <ElectionUrgentLiveFilters className={classes.electionLiveFilters} onDone={filterElectionState} />
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
        position: 'relative',
    },
    electionLiveFilters: {
        left: '1rem',
        position: 'absolute',
        zIndex: '500',
    },
    electionTable: {
        borderSpacing: '0',
        width: '100%',
        padding: '0 2.5rem',
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
    thead: {
        height: '3rem',
    },
    th: {
        fontWeight: '500',
        textAlign: 'left',
        paddingLeft: '3.5rem',
    },
    thDiv: {
        display: 'flex',
    },
    thContent: {
        display: 'flex',
        alignItems: 'center',
    },
    filterDropdown: {
        '& path': {
            stroke: theme.colorSecondaryText,
        },
    },
    sortIcon: {
        '& path': {
            fill: theme.colorSecondaryText,
        },
    },
    headerText: {
        padding: '0 0.75rem',
    },
    basicIcon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
    whiteIcon: {
        '& path': {
            stroke: 'white',
            /* fill: 'white', */
        },
    },
    invertedIcon: {
        WebkitFilter: 'invert(100%)',
        filter: 'invert(100%)',
        '& path': {
            WebkitFilter: 'invert(100%)',
            filter: 'invert(100%)',
        },
    },
    clickable: {
        cursor: 'pointer',
    },
    tr: {
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
    candidateStatusTable: {
        paddingLeft: '1rem',
    },
    formattedDates: {
        fontWeight: '400',
    },
    secondaryText: {
        color: theme.colorSecondaryText,
        '$archivedTr &': {
            color: 'white',
        },
    },
    dangerZoneDays: {
        color: theme.colorWarning,
    },
    statusCell: {},
    liveText: {
        fontWeight: '600',
        color: theme.colorSubmitted,
    },
    redText: {
        fontWeight: '600',
        color: theme.colorWarning,
    },
    electionNameCell: {
        height: '100%',
    },
    electionName: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        paddingLeft: '2rem',
    },
    electionNameText: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
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
    flipped: {
        transform: 'rotate(180deg)',
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
    },
    dropdownFilter: {
        position: 'absolute',
        top: '2.5rem',
        backgroundColor: theme.colorSecondary,
        color: 'white',
        padding: '1rem 1.75rem',
        transform: 'translateX(-50%)',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: '100',
    },
    dropdownItem: {
        padding: '0.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterIcon: {
        paddingRight: '1rem',
    },
    dropdownCheck: {
        paddingLeft: '3rem',
        '& path': {
            stroke: 'white',
        },
    },
}))
