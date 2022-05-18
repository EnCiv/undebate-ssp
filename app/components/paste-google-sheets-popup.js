// https://github.com/EnCiv/undebate-ssp/issues/55
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import _ from 'lodash'
import ExternalLinkSvg from '../svgr/external-link'
import LinkSvg from '../svgr/link'
import ObjectId from 'isomorphic-mongo-objectid'
import { handleTableData, validateHeaders } from '../lib/get-table-upload-methods'

function PasteGoogleSheetsPopup({ electionOM, closePopup, visible, className, style = {} }) {
    const SHEET_VALUES_RANGE = 'A:ZZ'
    const MISSING_HEADERS_ERROR = "Sheet is missing required headers. Please include 'name', 'email', and 'office'."
    const GENERAL_ERROR = 'Unable to extract data from link. Please compare your document with the sample document.'
    const LINK_NOT_FOUND_ERROR = 'Unable to find a Google Sheets Document at the below link.'
    const AUTH_TIMEOUT_ERROR = 'Timed out authorizing app to read provided spreadsheet. Please try again.'
    const UNAUTHORIZED_ERROR =
        'Could not authenticate Google Spreadsheets. Please allow access in the popup when clicking Extract Data.'
    const NO_DATA_FOUND_ERROR = 'No data found in sheet. Does data exist in range ' + SHEET_VALUES_RANGE + '?'

    const classes = useStyles()
    const [inputLink, setInputLink] = useState('')
    const [fileError, setFileError] = useState(null)
    let authWindow = null
    const uniqueId = ObjectId().toString()

    const onInputChange = event => {
        event.preventDefault()
        setInputLink(event.target.value)
        setFileError(null)
    }

    const linkIsGoogleSheets = () => {
        return inputLink.match(/[-\w]{25,}/)
    }

    const extractSheetData = rows => {
        const headers = rows.shift().map(val => _.camelCase(val))

        const data = []
        if (validateHeaders(headers)) {
            if (!rows.length) {
                setFileError(NO_DATA_FOUND_ERROR)
                return null
            }
            rows.forEach(row => {
                data.push(row)
            })
        } else {
            setFileError(MISSING_HEADERS_ERROR)
            return null
        }
        return data
    }

    const closeAuthTab = () => {
        if (authWindow) {
            authWindow.close()
            authWindow = null
        }
    }

    const handleSheetData = sheetData => {
        console.log('handle sheet data', sheetData)
        closeAuthTab()
        const rows = JSON.parse(sheetData)
        console.log('handleSheetData', rows)
        if (!rows.length) {
            setFileError(NO_DATA_FOUND_ERROR)
        } else {
            const tableData = extractSheetData(rows)
            handleTableData(tableData, electionOM)
            handleSuccessfulExtraction()
        }
    }

    const handleSuccessfulExtraction = () => {
        setInputLink('')
        closePopup()
    }

    const isSignedInResponse = authUrl => {
        window.socket.emit('extract-sheet-data', uniqueId, getSpreadsheetId(), handleSheetData)
        authWindow = window.open(authUrl, 'authWindow')
        // close the auth tab after 2 minutes
        setTimeout(() => {
            closeAuthTab()
            setFileError(AUTH_TIMEOUT_ERROR)
        }, 2 * 60 * 1000)
    }

    const handleValidSheetUrl = () => {
        window.socket.emit('is-signed-in-for-sheet', uniqueId, getSpreadsheetId(), isSignedInResponse)
    }

    const getSpreadsheetId = () => {
        return inputLink.match(/[-\w]{25,}/)[0]
    }

    const handleExtractClick = event => {
        event.preventDefault()
        setFileError(null)
        if (linkIsGoogleSheets()) {
            try {
                handleValidSheetUrl()
            } catch (exc) {
                console.error('general error: ', exc)
                setFileError(GENERAL_ERROR)
            }
        } else {
            setFileError(LINK_NOT_FOUND_ERROR)
        }
    }

    const isValidUrl = () => {
        let url
        try {
            url = new URL(inputLink)
        } catch (e) {
            return false
        }

        return url.protocol === 'https:'
    }

    const isExtractButtonEnabled = () => {
        return inputLink && isValidUrl(inputLink)
    }

    const close = () => {
        setFileError(null)
        closePopup()
    }

    const renderErrors = () => {
        return (
            <div className={classes.errorsRow} style={{ visibility: fileError ? 'visible' : 'hidden' }}>
                {fileError}
            </div>
        )
    }

    const renderPasteLink = () => {
        return (
            <div className={classes.inputLinkBox}>
                <input
                    id='sheets-link'
                    data-testid='sheets-link'
                    className={classes.inputLink}
                    type='text'
                    value={inputLink}
                    onChange={onInputChange}
                />
                <LinkSvg className={classes.linkIcon} />
            </div>
        )
    }

    return (
        <div
            id='paste-google-sheets-popup'
            className={cx(className, classes.popup)}
            style={{ visibility: visible ? 'visible' : 'hidden', ...style }}
        >
            <div className={classes.innerPopup}>
                <div className={classes.popupTop}>
                    <span className={classes.provideText}>Provide Election Table</span>
                    <div className={classes.checkSampleRow}>
                        <div>Paste Google Sheets Link</div>
                        <a href='todo' className={classes.checkSampleText}>
                            Check Sample &nbsp;
                            <ExternalLinkSvg className={classes.externalLinkIcon} />
                        </a>
                    </div>
                    {renderErrors()}
                    {renderPasteLink()}
                </div>
                <div className={classes.popupButtons}>
                    <button type='button' className={cx(classes.btn, classes.cancelButton)} onClick={close}>
                        Cancel
                    </button>
                    <button
                        id='extract-data-button'
                        type='button'
                        disabled={!isExtractButtonEnabled()}
                        className={cx(
                            classes.btn,
                            classes.extractButton,
                            !isExtractButtonEnabled() && classes.disabledExtractButton
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

export default PasteGoogleSheetsPopup

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
        height: theme.pastePopupHeight,
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
    pastedLinkText: {
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
    linkIcon: {
        height: '1.5rem',
        width: '1.5rem',
        paddingRight: '1.15rem',
    },
    inputLinkBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: theme.defaultBorderRadius,
        borderStyle: 'none',
        width: '100%',
        height: '3.5625rem',
        padding: '0',
        backgroundColor: theme.backgroundColorApp,
        '& svg path': {
            stroke: theme.colorSecondary,
        },
    },
    inputLink: {
        backgroundColor: theme.backgroundColorApp,
        borderRadius: theme.defaultBorderRadius,
        borderWidth: '0',
        width: '20.625rem',
        height: '100%',
        fontWeight: '500',
        fontSize: '1.125rem',
        lineHeight: '1.6875rem',
        padding: '0 1.25rem',
        boxSizing: 'border-box',
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
