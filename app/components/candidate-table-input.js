//https://github.com/EnCiv/undebate-ssp/issues/88
// example code thanks to https://react-table.tanstack.com/docs/examples/editable-data
import React, { useRef } from 'react'
import { createUseStyles } from 'react-jss'
import { useTable, usePagination, useFilters } from 'react-table'
import ObjectID from 'isomorphic-mongo-objectid'
import IsEmail from 'isemail'

// Create an editable cell renderer
function EditableCell(props) {
    const {
        value = '',
        row: { index, values },
        column: { id },
        updateMyData, // This is a custom function that we supplied to our table instance
    } = props
    const inputRef = useRef(null)

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        if (value !== inputRef.current.value) updateMyData(index, id, inputRef.current.value)
    }

    // If the initialValue is changed from above, update the input
    React.useEffect(() => {
        if (inputRef.current) inputRef.current.value = value
    }, [value])

    let style
    const warn = { backgroundColor: 'rgba(238, 96, 85, 0.25)' }
    if (
        id === 'email' &&
        typeof window !== 'undefined' && // document is not valid on server side render
        document.activeElement !== inputRef.current &&
        value &&
        !IsEmail.validate(value, { minDomainAtoms: 2 })
    )
        style = warn

    return (
        <input
            ref={inputRef}
            style={style}
            disabled={!updateMyData.editable}
            defaultValue={value}
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
            autoResetFilters: false,
        },
        useFilters,
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
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    {column.canFilter && column.Filter ? column.render('Filter') : ''}
                                </th>
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
                                const _page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(_page)
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
                        {[100, 50, 20, 10].map(_pageSize => (
                            <option key={_pageSize} value={_pageSize}>
                                Show {_pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </>
    )
}

function CandidateTableInput(props) {
    const { className, style, editable, defaultValue, onDone, columnNames, memoizedColumnVars = [] } = props
    const columns = React.useMemo(() => columnNames, memoizedColumnVars)

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

    return (
        <div className={className} style={style}>
            <Table columns={columns} data={data} updateMyData={updateMyData} skipPageReset={skipPageReset} />
        </div>
    )
}

export default CandidateTableInput

const useStyles = createUseStyles(theme => ({
    wrapper: {
        fontFamily: theme.defaultFont,
        width: '100%',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '1.5rem',
        backgroundColor: theme.backgroundColorApp,
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
                width: '1%',
                margin: 0,
                padding: '0.125rem',
                //borderBottom: '1px solid black',
                //borderRight: '1px solid black',

                ':last-child': {
                    borderRight: 0,
                },

                '& input': {
                    boxSizing: 'border-box',
                    width: '100%',
                    minWidth: '10rem',
                    fontSize: theme.inputFieldFontSize,
                    lineHeight: theme.inputFieldLineHeight,
                    color: theme.colorSecondary,
                    background: theme.inputFieldBackgroundColor,
                    padding: theme.inputFieldPadding,
                    margin: 0,
                    border: 0,
                },
            },
        },
    },
    pagination: {
        padding: '0.5rem',
    },
}))
