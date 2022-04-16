// https://github.com/EnCiv/undebate-ssp/issues/55
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import PasteGoogleSheetsPopup from './paste-google-sheets-popup'

function PasteGoogleSheetsLink(props) {
    const classes = useStyles()
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const [selected, setSelected] = useState(false)

    const handleButtonClick = () => {
        setSelected(!selected)
    }

    const closePopup = () => {
        setSelected(false)
    }

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <button
                id='paste-sheets-button'
                data-testid='paste-sheets-button'
                type='button'
                className={cx(
                    classes.btn,
                    classes.pasteSheetsButton,
                    selected ? classes.btnSelected : classes.btnDeselected
                )}
                onClick={handleButtonClick}
            >
                Paste Google Sheets Link &nbsp; /* <FilePlusSvg className={classes.filePlusIcon} /> */
            </button>
            <PasteGoogleSheetsPopup
                electionObj={electionObj}
                electionMethods={electionMethods}
                closePopup={closePopup}
                visible={selected}
                className={classes.popup}
            />
        </div>
    )
}

export default PasteGoogleSheetsLink

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
    pasteSheetsButton: {
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
        position: 'fixed',
        top: `calc((100vh - ${theme.csvPopupHeight}) / 2)`,
        left: `calc((100vw - ${theme.csvPopupWidth}) / 2)`,
    },
}))
