// https://github.com/EnCiv/undebate-ssp/issues/18
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import HomeButton from './home-button'
import BackButton from './back-button'
import InstructionButton from './instruction-button'

// if elections is a list of one, just show it and don't do a selector

function ElectionHeader(props) {
    const classes = useStyles()
    const { className, style, defaultValue = 0, elections = [], onDone = () => {} } = props

    return (
        <div className={cx(className, classes.electionHeader)} style={style}>
            <div>
                <BackButton className={classes.icon} />
                <HomeButton className={classes.icon} />
            </div>
            {elections.length > 1 ? (
                <select
                    defaultValue={defaultValue}
                    onChange={event => {
                        onDone({
                            value: event.target.value,
                            valid: true,
                        })
                    }}
                >
                    {elections.length > 0
                        ? elections.map((input, index) => <option value={index}>{input}</option>)
                        : null}
                </select>
            ) : (
                <span className={classes.title}>{elections[0] || ''}</span>
            )}
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
            fontFamily: theme.defaultFontFamily,
            fontSize: theme.headerFontSize,
            border: 'none',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    },
    title: {
        fontFamily: theme.defaultFontFamily,
        fontSize: theme.headerFontSize,
        fontWeight: 'bold',
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
        verticalAlign: 'middle',
    },
}))
