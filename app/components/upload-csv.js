// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import ObjectID from 'isomorphic-mongo-objectid'
import cx from 'classnames'
import FilePlusSvg from '../svgr/file-plus'
import FileSvg from '../svgr/file'
import ExternalLinkSvg from '../svgr/external-link'

function UploadCSV(props) {
    const classes = useStyles()
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const [selected, setSelected] = useState(false)

    const handleUploadClick = () => {
        setSelected(!selected)
    }

    const handleCancelClick = () => {
        setSelected(false)
    }

    const handleExtractClick = () => {}

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <button
                type='button'
                className={cx(
                    classes.btn,
                    classes.uploadButton,
                    selected ? classes.btnSelected : classes.btnDeselected
                )}
                onClick={handleUploadClick}
            >
                Upload CSV File &nbsp;
                <FilePlusSvg className={classes.filePlusIcon} />
            </button>
            <div className={classes.popup} style={{ visibility: selected ? 'visible' : 'hidden' }}>
                <div className={classes.innerPopup}>
                    <div className={classes.popupTop}>
                        <span className={classes.provideText}>Provide Election Table</span>
                        <div className={classes.checkSampleRow}>
                            <div>Upload CSV File</div>
                            <div className={classes.checkSampleText}>
                                Check Sample &nbsp;
                                <ExternalLinkSvg />
                            </div>
                        </div>
                        <div className={classes.dropFileBox}>
                            <FileSvg className={classes.fileIcon} />
                            <div>Drop file here</div>
                            <div>or BROWSE</div>
                        </div>
                    </div>
                    <div className={classes.popupButtons}>
                        <button
                            type='button'
                            className={cx(classes.btn, classes.cancelButton)}
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            className={cx(classes.btn, classes.extractButton)}
                            onClick={handleExtractClick}
                        >
                            Extract Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadCSV

const useStyles = createUseStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    filePlusIcon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
    fileIcon: {
        width: '4rem',
        height: '4rem',
        alignSelf: 'center',
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
    uploadButton: {
        width: '13.5625rem',
        height: '3.375rem',
        border: `2px solid ${theme.button.borderColor}`,
    },
    btnDeselected: {
        backgroundColor: 'transparent',
        color: theme.colorSecondary,
        '& svg path': {
            stroke: theme.colorSecondary,
        },
    },
    btnSelected: {
        backgroundColor: theme.colorSecondary,
        color: 'white',
    },
    popup: {
        backgroundColor: theme.colorSecondary,
        color: 'white',
        width: '29.6875rem',
        height: '41.25rem',
        display: 'flex',
        flexDirection: 'column',
        /* borderRadius: theme.defaultBorderRadius, */
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
        fontSize: '1.8rem',
        fontWeight: '700',
        lineHeight: '2.8rem',
        fontFamily: theme.defaultFontFamily,
    },
    checkSampleRow: {
        width: '100%',
        display: 'flex',
        '& div': {
            padding: '0.625rem',
        },
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5625rem 0',
    },
    checkSampleText: {
        color: theme.colorGray, // todo fix
        '& svg path': {
            stroke: theme.colorGray, // todo fix
        },
    },
    dropFileBox: {
        height: '21.6875rem',
        width: '100%',
        backgroundColor: theme.colorGray, // todo fix
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.defaultBorderRadius,
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
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: theme.colorGray, // todo fix
        backgroundColor: theme.colorSecondary,
    },
    extractButton: {
        color: 'white',
        width: '11rem',
        justifyContent: 'center',
        backgroundColor: theme.colorPrimary,
    },
}))
