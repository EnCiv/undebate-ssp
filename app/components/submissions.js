// https://github.com/EnCiv/undebate-ssp/issues/56

import React, { useState, useCallback } from 'react'
import { createUseStyles } from 'react-jss'
import { getStatus } from './lib/get-candidate-invite-status'
import CandidateTableInput from './candidate-table-input'
import ElectionCategory, { statusInfoEnum } from './election-category'
import InviteMeter from './invite-meter'
import { SvgCheckMark, SvgChevronDown } from './lib/svg'

function StatusText({ value }) {
    const classes = statusTextUseStyles()
    return value in statusInfoEnum ? (
        <span className={`${classes.statusText}`}>
            {statusInfoEnum[value]?.icon} {statusInfoEnum[value]?.text}
        </span>
    ) : (
        value
    )
}

const createFilterList = items =>
    function FilterList({ column: { setFilter, filterVisible, filterValue } }) {
        if (!filterVisible) {
            return null
        }
        const classes = filterListUseStyles()
        const handleItemClick = item => e => {
            e.stopPropagation()
            setFilter(item === filterValue ? undefined : item)
        }
        return (
            <ul className={classes.filterList}>
                {items.map(item => (
                    <li className={classes.filterItem}>
                        <button onClick={handleItemClick(item)} type='button' className={classes.filterButton}>
                            <StatusText value={item} />
                        </button>
                        <SvgCheckMark className={filterValue !== item ? classes.invisible : ''} />
                    </li>
                ))}
            </ul>
        )
    }

function Header({ children, disabled, toggleFilter = () => {} }) {
    const classes = headerUseStyles()
    const handleClick = e => {
        e.stopPropagation()
        toggleFilter()
    }
    return (
        <button type='button' disabled={disabled} onClick={handleClick} className={classes.header}>
            {children}
            {disabled ? '' : <SvgChevronDown className={classes.chevron} />}
        </button>
    )
}

export default function Submissions({ className, style, electionOM }) {
    const classes = useStyles()
    const [electionObj, electionMethods] = electionOM
    const [statusFilterVisible, setStatusFilterVisible] = useState(false)
    const [officeFilterVisible, setOfficeFilterVisible] = useState(false)

    const statusClasses = {
        videoSubmitted: classes.successText,
        deadlineMissed: classes.errorText,
        declined: classes.errorText,
    }
    const rawCandidateValues = Object.values(electionObj.candidates ?? {})
    const candidateValues =
        rawCandidateValues.length === 0 ? [{ name: ' ', office: ' ', status: ' ' }] : rawCandidateValues
    const candidates = candidateValues.map(candidate => {
        const status = getStatus(candidate, electionObj?.timeline?.candidateSubmissionDeadline[0]?.date)
        return {
            status,
            rowClass: statusClasses[status] ?? '',
            ...candidate,
        }
    })

    const officeItems = [...new Set(candidates.map(v => v.office))]
    const statusItems = [...new Set(candidates.map(v => v.status))]

    const filterDisabled = rawCandidateValues.length === 0

    const calcCornerClass = (columnId, rowIndex, lastRowIndex) => {
        const cornerClasses = []
        if (columnId === 'name') {
            if (rowIndex === 0) {
                cornerClasses.push(classes.topLeftCell)
            }
            if (rowIndex === lastRowIndex) {
                cornerClasses.push(classes.bottomLeftCell)
            }
        } else if (columnId === 'status') {
            if (rowIndex === 0) {
                cornerClasses.push(classes.topRightCell)
            }
            if (rowIndex === lastRowIndex) {
                cornerClasses.push(classes.bottomRightCell)
            }
        }
        return cornerClasses.join(' ')
    }

    const lastRowIndex = candidates.length - 1

    const TableCell = useCallback(
        ({ value, column, row }) => {
            if (!value) {
                return null
            }
            const normalValue = value.charAt(0).toLowerCase() + value.slice(1)
            const status = normalValue in statusInfoEnum ? normalValue : ''
            const categoryName = status ? '' : value
            const cornerClass = calcCornerClass(column.id, row.index, lastRowIndex)

            return (
                <ElectionCategory
                    categoryName={categoryName}
                    statusObjs={status}
                    className={`${classes.tableCell} ${row.original.rowClass} ${cornerClass}`}
                />
            )
        },
        [classes, calcCornerClass, lastRowIndex]
    )

    return (
        <div className={`${className} ${classes.wrapper}`} style={style}>
            <InviteMeter electionOM={electionOM} className={classes.inviteMeter} />
            <CandidateTableInput
                electionOM={electionOM}
                defaultValue={candidates}
                columnNames={[
                    {
                        Header: <Header disabled>Candidate Name</Header>,
                        accessor: 'name',
                        Cell: TableCell,
                    },
                    {
                        Header: (
                            <Header disabled={filterDisabled} toggleFilter={() => setOfficeFilterVisible(v => !v)}>
                                Office
                            </Header>
                        ),
                        accessor: 'office',
                        Cell: TableCell,
                        filter: 'includes',
                        Filter: createFilterList(officeItems),
                        filterVisible: officeFilterVisible,
                    },
                    {
                        Header: (
                            <Header disabled={filterDisabled} toggleFilter={() => setStatusFilterVisible(v => !v)}>
                                Submission Status
                            </Header>
                        ),
                        accessor: 'status',
                        Cell: TableCell,
                        filter: 'includes',
                        Filter: createFilterList(statusItems),
                        filterVisible: statusFilterVisible,
                    },
                ]}
                memoizedColumnVars={[statusFilterVisible, officeFilterVisible, lastRowIndex]}
                onDone={() => {}}
            />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: {
        margin: '2.5rem',
    },
    tableCell: {
        backgroundColor: 'white',
        borderRadius: 0,
        // width: '15rem',
    },
    cornerCell: {
        borderRadius: theme.defaultBorderRadius,
    },
    header: {
        width: '15rem',
    },
    inviteMeter: {
        marginBottom: '.75rem',
    },
    errorText: { backgroundColor: theme.backgroundColorWarning },
    successText: { backgroundColor: `${theme.colorSubmitted}80` },
    topRightCell: { borderTopRightRadius: theme.defaultBorderRadius },
    bottomRightCell: { borderBottomRightRadius: theme.defaultBorderRadius },
    topLeftCell: { borderTopLeftRadius: theme.defaultBorderRadius },
    bottomLeftCell: { borderBottomLeftRadius: theme.defaultBorderRadius },
}))

const filterListUseStyles = createUseStyles(theme => ({
    invisible: { visibility: 'hidden' },
    filterList: {
        display: 'flex',
        position: 'absolute',

        backgroundColor: theme.colorSecondary,
        borderRadius: theme.defaultBorderRadius,
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'start',
        listStyleType: 'none',
        padding: '0.75rem',
    },
    filterItem: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    filterButton: {
        backgroundColor: theme.colorSecondary,
        border: 'none',
        color: 'white',
        marginRight: '1rem',
        fontFamily: 'inherit',
    },
}))

const statusTextUseStyles = createUseStyles(theme => ({
    statusText: {
        display: 'inline-block',
        height: '100%',
    },
}))

const headerUseStyles = createUseStyles(theme => ({
    header: {
        ...theme.button,
        width: '15rem',
        border: 'none',
        padding: '.25rem',
        '&:disabled': { color: 'initial' },
        '&:not(:hover)': {
            backgroundColor: theme.backgroundColorApp,
        },
    },
    chevron: {
        marginLeft: '1rem',
    },
}))
