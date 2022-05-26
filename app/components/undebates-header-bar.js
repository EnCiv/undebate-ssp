// https://github.com/EnCiv/undebate-ssp/issues/22

import React, { createUseStyles } from 'react-jss'
import cx from 'classnames'

import SearchButton from './search-button'
import InstructionsButton from './instruction-button'
import LinkButton from './link-button'
import SignInButton from './sign-in-button'
import SubmitButton from './submit'

import UserImage from './user-image'

import LogoutSVG from '../svgr/log-out'
import UndebateLogoSVG from '../svgr/undebate-logo'

function UndebatesHeaderBar(props) {
    const { className, style, user, electionOM } = props
    // eslint-disable-next-line no-unused-vars
    const [electionObj, electionMethods] = electionOM

    const classes = useStylesFromThemeFunction(props)

    const handleCreateNew = valid => {
        if (valid) electionMethods.createNew()
    }

    let userBtns
    if (user) {
        userBtns = (
            <>
                <SubmitButton name='Create New' onDone={handleCreateNew} />
                <div className={classes.userImageGroup}>
                    <div className={classes.hoverGroup}>
                        <span className={classes.userEmail}>{user.email}</span>
                        <LinkButton href='/sign/out' style={{ padding: '1rem' }}>
                            <LogoutSVG className={classes.svg} />
                            LOGOUT
                        </LinkButton>
                    </div>
                    <UserImage />
                </div>
            </>
        )
    } else {
        userBtns = (
            <>
                <SignInButton />
                <SignInButton name={'Sign Up'} />
            </>
        )
    }
    return (
        <div className={cx(className, classes.undebatesHeader)} style={style}>
            <UndebateLogoSVG className={classes.logo} />
            <div className={classes.buttonGroup}>
                <SearchButton className={classes.svg} />
                <InstructionsButton className={classes.svg} />
                {userBtns}
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
    userImageGroup: {
        display: 'flex',
        alignItems: 'center',
        background: theme.colorPrimary,
        height: '3.25rem',
        border: 'none',
        borderRadius: theme.buttonBorderRadius,
        width: 'auto',
        '&:hover': {
            '& > $hoverGroup': {
                width: '19rem',
            },
        },
    },
    hoverGroup: {
        transition: 'width 0.5s',
        display: 'flex',
        height: '3.25rem',
        overflow: 'hidden',
        borderRadius: theme.buttonBorderRadius,
        width: '0',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userEmail: {
        opacity: theme.secondaryTextOpacity,
        color: '#FFFFFF',
        marginLeft: '2rem',
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
