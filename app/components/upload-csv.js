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
                className={cx(classes.btn, selected ? classes.btnSelected : classes.btnDeselected)}
                onClick={handleUploadClick}
            >
                Upload CSV File &nbsp;
                <FilePlusSvg className={classes.filePlusIcon} />
            </button>
            <div className={classes.popup} style={{ visibility: selected ? 'visible' : 'hidden' }}>
                <div className={classes.innerPopup}>
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
    btnDeselected: {
        backgroundColor: theme.backgroundColorComponent,
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
        width: '30rem',
        height: '41rem',
        border: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.defaultBorderRadius,
    },
    innerPopup: {
        width: '24rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    provideText: {
        width: '100%',
        fontSize: '1.8rem',
        fontWeight: '700',
        lineHeight: '2.8rem',
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
    },
    checkSampleText: {
        color: theme.colorGray, // todo fix
        '& svg path': {
            stroke: theme.colorGray, // todo fix
        },
    },
    dropFileBox: {
        height: '21rem',
        width: '100%',
        margin: '1.25rem 0',
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
