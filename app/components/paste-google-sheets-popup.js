// https://github.com/EnCiv/undebate-ssp/issues/55
import React, { useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import ObjectID from 'isomorphic-mongo-objectid'
import cx from 'classnames'
import _ from 'lodash'
import ExternalLinkSvg from '../svgr/external-link'

function PasteGoogleSheetsPopup({ electionObj, electionMethods, closePopup, visible, className, style = {} }) {
    const classes = useStyles()
    const [pastedLink, setPastedLink] = useState(null)
    const [fileError, setFileError] = useState(null)

    const renderErrors = () => {
        return (
            <div className={classes.errorsRow} style={{ visibility: fileError ? 'visible' : 'hidden' }}>
                {fileError}
            </div>
        )
    }

    const handleExtractClick = event => {
        event.preventDefault()
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
                        <a href='/assets/csv/sample-candidate-table.csv' className={classes.checkSampleText}>
                            Check Sample &nbsp;
                            <ExternalLinkSvg className={classes.externalLinkIcon} />
                        </a>
                    </div>
                    {renderErrors()}
                </div>
                <div className={classes.popupButtons}>
                    <button type='button' className={cx(classes.btn, classes.cancelButton)} onClick={close}>
                        Cancel
                    </button>
                    <button
                        id='extract-data-button'
                        type='button'
                        disabled={!pastedLink}
                        className={cx(classes.btn, classes.extractButton, !pastedLink && classes.disabledExtractButton)}
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
        width: theme.csvPopupWidth,
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
