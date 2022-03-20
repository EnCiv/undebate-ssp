// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import ObjectID from 'isomorphic-mongo-objectid'
import cx from 'classnames'
import { FileDrop } from 'react-file-drop'
import FileSvg from '../svgr/file'
import ExternalLinkSvg from '../svgr/external-link'

function UploadCSVPopup({ electionObj, electionMethods, handleCancelClick, visible }) {
    const classes = useStyles()
    const [selectedFile, setSelectedFile] = useState(null)

    const handleTextFile = fileContents => {
        console.log('file contents: ', fileContents)
        fileContents.split('\n').forEach(row => {
            console.log(row)
        })
    }

    const handleExtractClick = () => {
        const reader = new FileReader()
        // todo handle read errors here
        reader.onload = () => {
            handleTextFile(reader.result)
        }
        reader.readAsText(selectedFile)
    }

    const handleFileDrop = (files, event) => {
        console.log('onDrop', files[0], event.target)
        // todo handle multiple files here
        setSelectedFile(files[0])
    }

    return (
        <div className={classes.popup} style={{ visibility: visible ? 'visible' : 'hidden' }}>
            <div className={classes.innerPopup}>
                <div className={classes.popupTop}>
                    <span className={classes.provideText}>Provide Election Table</span>
                    <div className={classes.checkSampleRow}>
                        <div>Upload CSV File</div>
                        <div className={classes.checkSampleText}>
                            Check Sample &nbsp;
                            <ExternalLinkSvg className={classes.externalLinkIcon} />
                        </div>
                    </div>
                    <div className={classes.dropFileBox}>
                        <FileDrop onDrop={handleFileDrop}>
                            <div className={classes.dropFileDiv}>
                                <FileSvg className={classes.fileIcon} />
                                <div className={classes.dropFileText}>Drop file here</div>
                            </div>
                            <div className={classes.browseDiv}>
                                <span className={classes.orText}>or</span>{' '}
                                <span className={classes.browseText}>BROWSE</span>
                            </div>
                        </FileDrop>
                    </div>
                </div>
                <div className={classes.popupButtons}>
                    <button type='button' className={cx(classes.btn, classes.cancelButton)} onClick={handleCancelClick}>
                        Cancel
                    </button>
                    <button
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
        margin: '20px 0',
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
        width: '29.6875rem',
        height: '41.25rem',
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
        padding: '1.5625rem 0',
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
    dropFileBox: {
        height: '21.6875rem',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& .file-drop > .file-drop-target.file-drop-dragging-over-frame': {
            border: '2px solid blue',
        },
        borderRadius: theme.defaultBorderRadius,
        '& .file-drop > .file-drop-target.file-drop-dragging-over-target': {
            color: '#ff6e40',
            boxShadow: '0 0 13px 3px #ff6e40',
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
        color: 'white',
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
