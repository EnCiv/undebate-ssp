// https://github.com/EnCiv/undebate-ssp/issues/54
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import ObjectID from 'isomorphic-mongo-objectid'
import cx from 'classnames'
import FilePlus from '../svgr/file-plus'
import FilePlusDark from '../svgr/file-plus-dark'

function UploadCSV(props) {
    const classes = useStyles()
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const [selected, setSelected] = useState(false)

    const handleOnClick = () => {
        setSelected(!selected)
    }

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <button
                type='button'
                className={cx(classes.btn, selected ? classes.btnSelected : classes.btnDeselected)}
                onClick={handleOnClick}
            >
                Upload CSV File &nbsp;
                <FilePlus className={classes.filePlusIcon} />
            </button>
        </div>
    )
}

export default UploadCSV

const useStyles = createUseStyles(theme => ({
    wrapper: {},
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
}))
