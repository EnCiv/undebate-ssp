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

    const closePopup = () => {
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
                closePopup={closePopup}
                visible={selected}
                className={classes.popup}
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
        position: 'relative',
    },
    filePlusIcon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
    btn: {
        ...theme.button,
        display: 'flex',
        justifyContent: 'space-between',
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
        position: 'absolute',
        top: 'calc(100% + 0.75rem)',
        transform: 'translateX(-25%)',
    },
}))
