// https://github.com/EnCiv/undebate-ssp/issues/18
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import HomeButton from './home-button'
import BackButton from './back-button'
import InstructionButton from './instruction-button'

function ElectionHeader(props) {
    const classes = useStyles()
    const { className, style, defaultValue = 0, elections = [], onDone = () => {} } = props

    return (
        <div className={cx(className, classes.electionHeader)} style={style}>
            <div>
                <BackButton className={classes.icon} />
                <HomeButton className={classes.icon} />
            </div>
            <select
                defaultValue={defaultValue}
                onChange={event => {
                    onDone({
                        value: event.target.value,
                        valid: true,
                    })
                }}
            >
                {elections.length > 0 ? elections.map((input, index) => <option value={index}>{input}</option>) : null}
            </select>
            <div>
                <InstructionButton className={classes.icon} />
            </div>
        </div>
    )
}

export default ElectionHeader

const useStyles = createUseStyles(theme => ({
    electionHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',

        '& select': {
            fontSize: theme.headingFontSize,
            border: 'none',
            fontWeight: 'bold',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
}))
