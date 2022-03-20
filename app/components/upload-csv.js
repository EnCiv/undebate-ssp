// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import FilePlusSvg from '../svgr/file-plus'
import UploadCSVPopup from './upload-csv-popup'

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
            <UploadCSVPopup
                electionObj={electionObj}
                electionMethods={electionMethods}
                handleCancelClick={handleCancelClick}
                visible={selected}
            />
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
}))
