//https://github.com/EnCiv/undebate-ssp/issues/88
// example code thanks to https://react-table.tanstack.com/docs/examples/editable-data
import React, { useRef } from 'react'
import { createUseStyles } from 'react-jss'
import { useTable, usePagination } from 'react-table'
import ObjectID from 'isomorphic-mongo-objectid'

// Create an editable cell renderer
function EditableCell({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
}) {
    const inputRef = useRef(null)

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        if (initialValue !== inputRef.current.value) updateMyData(index, id, inputRef.current.value)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        if (inputRef.current) onBlur()
    }, [initialValue])

    return (
        <input
            ref={inputRef}
            disabled={id === 'status' || !updateMyData.editable}
            defaultValue={initialValue}
            onBlur={onBlur}
        />
    )
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
    Cell: EditableCell,
}

// Be sure to pass our updateMyData and the skipPageReset option
function Table({ columns, data, updateMyData, skipPageReset }) {
    // For this example, we're using pagination to illustrate how to stop
    // the current page from resetting when our data changes
    // Otherwise, nothing is different here.
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            // use the skipPageReset option to disable page resetting temporarily
            autoResetPage: !skipPageReset,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateMyData,
            initialState: { pageSize: 100 },
        },
        usePagination
    )
    const classes = useStyles()
    // Render the UI for your table
    return (
        <>
            <table {...getTableProps()} className={classes.wrapper}>
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
                    {page.map((row, i) => {
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
            {data.length > pageSize && (
                <div className='pagination'>
                    <button type='button' onClick={() => gotoPage(0)} disabled={!canPreviousPage} title='First page'>
                        {'<<'}
                    </button>{' '}
                    <button
                        type='button'
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        title='Previous page'
                    >
                        {'<'}
                    </button>{' '}
                    <button type='button' onClick={() => nextPage()} disabled={!canNextPage} title='Next page'>
                        {'>'}
                    </button>{' '}
                    <button
                        type='button'
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        title='Lasat page'
                    >
                        {'>>'}
                    </button>{' '}
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <span>
                        | Go to page:{' '}
                        <input
                            type='number'
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>{' '}
                    <select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[100, 50, 20, 10].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </>
    )
}

function CandidateTableInput(props) {
    const { className, style, editable, defaultValue, onDone } = props
    const columns = React.useMemo(
        () => [
            {
                Header: 'Candidate Name',
                accessor: 'name',
            },
            {
                Header: 'Email Address',
                accessor: 'email',
            },
            {
                Header: 'Office',
                accessor: 'office',
            },
            {
                Header: 'Region',
                accessor: 'region',
            },
            {
                Header: 'Invite Status',
                accessor: 'status',
            },
            /*            {
                Header: 'Unique Id',
                accessor: 'uniqueId',
            },*/
        ],
        []
    )

    // candidates is an object like
    // candidates: {'uniqueId': {name, ...}, 'uniqueId2': {name, ...}, ...}
    // but the table needs an array like
    // [{name, ...}, {name, ...}, ...]

    const data = defaultValue.slice()

    // if the last line is not blank, create an empty last line
    if (
        !data.length ||
        (editable &&
            data.length &&
            Object.entries(data[data.length - 1]).some(([key, val]) => key !== 'uniqueId' && val))
    ) {
        const uniqueId = ObjectID().toString()
        data.push({ uniqueId })
    }

    const [skipPageReset, setSkipPageReset] = React.useState(false)
    const addRow = () => {
        const uniqueId = ObjectID().toString()
        onDone({ valid: true, value: { uniqueId } })
    }

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        const newRow = { ...data[rowIndex], [columnId]: value }
        if (Object.entries(newRow).some(([key, val]) => key !== 'uniqueId' && val))
            // only upsert rows when there is something in it
            onDone({ valid: true, value: newRow })
    }
    updateMyData.editable = editable // need to get this to EditableCell without drilling

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        setSkipPageReset(false)
    }, [data])

    const classes = useElectionStyles()

    return (
        <div className={className} style={style}>
            <Table columns={columns} data={data} updateMyData={updateMyData} skipPageReset={skipPageReset} />
            {editable && (
                <button className={classes.addQuestionBtn} onClick={addRow} type='button'>
                    Add Candidate
                </button>
            )}
        </div>
    )
}
const useElectionStyles = createUseStyles({
    addQuestionBtn: {
        color: '#262D33',
        background: 'white',
        border: '1px solid #262D33',
        alignSelf: 'flex-start',
        padding: '.9rem 1.3rem',
        borderRadius: '1.875rem',
        fontWeight: 600,
        '&:hover': {
            cursor: 'pointer',
        },
        marginTop: '0.5rem',
    },
})

export default CandidateTableInput

const useStyles = createUseStyles({
    wrapper: {
        fontFamily: 'poppins',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '1.5rem',
        padding: '1rem',
        backgroundColor: '#ECECEC',
        'table&': {
            borderSpacing: 0,
            '& tr': {
                ':last-child': {
                    td: {
                        borderBottom: 0,
                    },
                },
            },
            '& th': {
                color: '#262D3380',
                paddingBottom: '1rem',
            },
            '& td': {
                margin: 0,
                padding: '0.125rem',
                //borderBottom: '1px solid black',
                //borderRight: '1px solid black',

                ':last-child': {
                    borderRight: 0,
                },

                '& input': {
                    fontSize: '1.125rem',
                    lineHeight: '1.6875',
                    color: '#262D33B3',
                    background: 'linear-gradient(0deg, rgba(38, 45, 51, 0.2), rgba(38, 45, 51, 0.2)), #FFFFFF',
                    padding: '1rem 1.25rem',
                    margin: 0,
                    border: 0,
                },
            },
        },
    },
    pagination: {
        padding: '0.5rem',
    },
})
