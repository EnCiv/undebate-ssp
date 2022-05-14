// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { FileDrop } from 'react-file-drop'
import _ from 'lodash'
import FileSvg from '../svgr/file'
import ExternalLinkSvg from '../svgr/external-link'
import { handleTableData, validateHeaders } from '../lib/get-table-upload-methods'

function UploadCSVPopup({ electionOM, closePopup, visible, className, style = {} }) {
    const GENERAL_ERROR = 'Unable to extract data from file. Please compare this file with the sample file.'
    const UNABLE_TO_READ_FILE_ERROR = 'Unable to read file. Please confirm this is a csv file.'
    const TOO_MANY_FILES_ERROR = 'Too many files, please only upload one file at a time.'
    const MISSING_HEADERS_ERROR = "File is missing required headers. Please include 'name', 'email', and 'office'."

    const classes = useStyles()
    const fileInputEl = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileError, setFileError] = useState(null)

    const extractCsvData = fileContents => {
        const rows = fileContents.split('\n')
        const headers = rows
            .shift()
            .split(',')
            .map(val => _.camelCase(val))

        const data = []
        if (validateHeaders(headers)) {
            rows.forEach(row => {
                data.push(
                    row.split(',').reduce((rowObj, item, idx) => {
                        rowObj[headers[idx]] = item
                        return rowObj
                    }, {})
                )
            })
        } else {
            setFileError(MISSING_HEADERS_ERROR)
            return null
        }
        return data
    }

    const handleTextFile = fileContents => {
        if (fileContents === 'non text string') {
            setFileError(UNABLE_TO_READ_FILE_ERROR)
        } else {
            const csvData = extractCsvData(fileContents)
            if (csvData) {
                handleTableData(csvData, electionOM)
                handleSuccessfulExtraction()
            }
        }
    }

    const handleSuccessfulExtraction = () => {
        handleRemoveFile()
        closePopup()
    }

    const handleExtractClick = event => {
        event.preventDefault()
        setFileError(null)
        const reader = new FileReader()
        reader.onload = () => {
            try {
                handleTextFile(reader.result)
            } catch (exc) {
                console.error('general error: ', exc)
                setFileError(GENERAL_ERROR)
            }
        }
        reader.onerror = () => {
            setFileError(UNABLE_TO_READ_FILE_ERROR)
        }
        reader.readAsText(selectedFile)
    }

    const handleFileDrop = (files, event) => {
        event.preventDefault()
        fileInputEl.current.files = files
        handleFiles()
    }

    const onFileChange = event => {
        event.preventDefault()
        handleFiles()
        return false
    }

    const handleFiles = () => {
        setFileError(null)
        if (fileInputEl.current.files && fileInputEl.current.files.length > 1) {
            handleRemoveFile(TOO_MANY_FILES_ERROR)
        } else if (fileInputEl.current.files && fileInputEl.current.files.length === 0) {
            handleRemoveFile()
        } else {
            setSelectedFile(fileInputEl.current.files[0])
            fileInputEl.current.files = selectedFile
            setFileError(null)
        }
    }

    const handleRemoveFile = newFileError => {
        setSelectedFile(null)
        setFileError(newFileError)
        fileInputEl.current.value = null
    }

    const close = () => {
        setFileError(null)
        closePopup()
    }

    const renderErrors = () => {
        return (
            <div
                data-testid='upload-csv-error'
                className={classes.errorsRow}
                style={{ visibility: fileError ? 'visible' : 'hidden' }}
            >
                {fileError}
            </div>
        )
    }

    const renderDropFile = () => {
        return (
            <label htmlFor='file-select'>
                <FileDrop onDrop={handleFileDrop} className={cx(classes.fileBox, classes.dropFileBox)}>
                    <div className={classes.dropFileDiv}>
                        <FileSvg className={classes.fileIcon} />
                        <div className={classes.dropFileText}>Drop file here</div>
                    </div>
                    <div className={classes.browseDiv}>
                        <span className={classes.orText}>or</span> <span className={classes.browseText}>BROWSE</span>
                    </div>
                </FileDrop>
            </label>
        )
    }

    const renderSelectedFileBox = () => {
        return (
            <div className={classes.fileBox}>
                <div className={classes.selectedFileText}>{selectedFile.name}</div>
                <button type='button' className={classes.removeFileButton} onClick={() => handleRemoveFile()}>
                    Remove File
                </button>
            </div>
        )
    }

    return (
        <div
            id='upload-csv-popup'
            className={cx(className, classes.popup)}
            style={{ visibility: visible ? 'visible' : 'hidden', ...style }}
        >
            <div className={classes.innerPopup}>
                <div className={classes.popupTop}>
                    <span className={classes.provideText}>Provide Election Table</span>
                    <div className={classes.checkSampleRow}>
                        <div>Upload CSV File</div>
                        <a href='/assets/csv/sample-candidate-table.csv' className={classes.checkSampleText}>
                            Check Sample &nbsp;
                            <ExternalLinkSvg className={classes.externalLinkIcon} />
                        </a>
                    </div>
                    {renderErrors()}
                    {selectedFile ? renderSelectedFileBox() : renderDropFile()}
                    <input
                        type='file'
                        id='file-select'
                        key='1'
                        data-testid='file-select-input'
                        style={{ display: 'none' }}
                        ref={fileInputEl}
                        onChange={onFileChange}
                    />
                </div>
                <div className={classes.popupButtons}>
                    <button type='button' className={cx(classes.btn, classes.cancelButton)} onClick={close}>
                        Cancel
                    </button>
                    <button
                        id='extract-csv-button'
                        type='button'
                        disabled={!selectedFile}
                        className={cx(
                            classes.btn,
                            classes.extractButton,
                            !selectedFile && classes.disabledExtractButton
                        )}
                        onClick={handleExtractClick}
                    >
                        Extract Data
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UploadCSVPopup

const useStyles = createUseStyles(theme => ({
    fileIcon: {
        width: '4rem',
        height: '4rem',
        margin: '1.25rem 0',
    },
    btn: {
        ...theme.button,
        display: 'flex',
        justifyContent: 'space-between',
        border: 'none',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    popup: {
        backgroundColor: theme.colorSecondary,
        color: 'white',
        width: theme.uploadPopupWidth,
        height: theme.csvPopupHeight,
        display: 'flex',
        flexDirection: 'column',
        /* borderRadius: theme.defaultBorderRadius, // this is smaller than the radius on figma */
        borderRadius: '1.25rem',
    },
    innerPopup: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem',
    },
    popupTop: {
        width: '100%',
        height: '30.375rem',
    },
    provideText: {
        width: '100%',
        fontSize: '1.875rem',
        fontWeight: '700',
        lineHeight: '2.8rem',
    },
    checkSampleRow: {
        width: '100%',
        display: 'flex',
        '& div': {
            padding: '0.625rem',
        },
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.5rem',
        fontWeight: '500',
    },
    checkSampleText: {
        fontSize: '0.875rem',
        color: 'white',
        opacity: '0.5',
        display: 'flex',
        alignItems: 'center',
    },
    externalLinkIcon: {
        width: '1rem',
        height: '1rem',
        '& path': {
            strokeWidth: '3',
        },
    },
    errorsRow: {
        color: 'red',
        display: 'flex',
        alignItems: 'center',
        height: '2.375rem',
        padding: '0 0.25rem 0.25rem 0.25rem',
    },
    fileBox: {
        height: '21.6875rem',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.defaultBorderRadius,
    },
    dropFileBox: {
        cursor: 'pointer',
        '& > .file-drop-target': {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        '& > .file-drop-target.file-drop-dragging-over-frame': {
            border: `2px solid ${theme.colorPrimary}`,
            borderRadius: theme.defaultBorderRadius,
        },
        '& > .file-drop-target.file-drop-dragging-over-target': {
            color: theme.colorSuccess,
            boxShadow: `0 0 13px 3px ${theme.colorSuccess}`,
            '& svg path': {
                stroke: theme.colorSuccess,
                fill: theme.colorSuccess,
            },
        },
    },
    dropFileDiv: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropFileText: {
        fontSize: '0.875rem',
        fontWeight: '500',
        opacity: '0.5',
    },
    browseDiv: {
        padding: '0.625rem',
        '& span': {
            padding: '0.375rem',
        },
    },
    orText: {
        fontWeight: '500',
        opacity: '0.5',
    },
    browseText: {
        fontSize: '1.125rem',
        fontWeight: '700',
    },
    selectedFileText: {
        width: '100%',
        fontSize: '2rem',
        textAlign: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
        overflowWrap: 'break-word',
    },
    removeFileButton: {
        ...theme.button,
        borderRadius: theme.defaultBorderRadius,
        padding: '0.5rem',
    },
    popupButtons: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    cancelButton: {
        color: 'white',
        width: '11rem',
        justifyContent: 'center',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: theme.colorSecondary,
    },
    extractButton: {
        color: 'white',
        width: '11rem',
        justifyContent: 'center',
        backgroundColor: theme.colorPrimary,
    },
    disabledExtractButton: {
        opacity: theme.disabledOpacity,
        '&:hover': {
            cursor: 'not-allowed',
        },
    },
}))
