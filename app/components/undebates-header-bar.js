// https://github.com/EnCiv/undebate-ssp/issues/22

import React, { createUseStyles } from 'react-jss'
import cx from 'classnames'

import SearchButton from './search-button'
import InstructionsButton from './instruction-button'
import SubmitButton from './submit'

import UndebateLogoSVG from '../svgr/undebate-logo'
import UserOrSignup from './user-or-signup'

function UndebatesHeaderBar(props) {
    const { className, style, user, electionOM } = props
    // eslint-disable-next-line no-unused-vars
    const [electionObj, electionMethods] = electionOM

    const classes = useStylesFromThemeFunction(props)

    const handleCreateNew = valid => {
        if (valid) electionMethods.createNew()
    }

    return (
        <div className={cx(className, classes.undebatesHeader)} style={style}>
            <UndebateLogoSVG className={classes.logo} />
            <div className={classes.buttonGroup}>
                <SearchButton className={classes.svg} />
                <InstructionsButton className={classes.svg} />
                {user && <SubmitButton name='Create New' onDone={handleCreateNew} />}
                <UserOrSignup user={user} />
            </div>
        </div>
    )
}

export default UndebatesHeaderBar

const useStylesFromThemeFunction = createUseStyles(theme => ({
    undebatesHeader: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '1rem 1rem 1rem 1rem',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '2rem',
        alignItems: 'center',
    },
    svg: {
        width: theme.iconSize,
        height: theme.iconSize,
    },
    logo: {
        height: '2.75rem',
        width: '12.5rem',
        marginRight: 'auto',
    },
    '@media screen and (max-width: 56rem)': {
        undebatesHeader: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            marginRight: '0',
            width: '100rem',
        },
        buttonGroup: {
            flexDirection: 'column',
        },
    },
}))
