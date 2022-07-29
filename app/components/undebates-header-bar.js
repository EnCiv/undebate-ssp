// https://github.com/EnCiv/undebate-ssp/issues/22

import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import InstructionsButton from './instruction-button'
import SubmitButton from './submit'
import MagnifyingGlassSVG from '../svgr/magnifying-glass'

import UndebateLogoSVG from '../svgr/undebate-logo'
import UserOrSignup from './user-or-signup'

function UndebatesHeaderBar(props) {
    const { className, style, user, electionOM = [{}, {}], destination, onDone } = props
    // eslint-disable-next-line no-unused-vars
    const [electionObj, electionMethods] = electionOM
    const [isSearching, setIsSearching] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const classes = useStylesFromThemeFunction(props)
    const headerBarRef = React.createRef()
    const searchInputRef = React.createRef()

    useEffect(() => {
        const handleEscapeKey = e => {
            if (e.key === 'Escape') {
                closeSearch?.()
            }
        }

        document.addEventListener('keyup', handleEscapeKey)

        return () => {
            document.removeEventListener('keyup', handleEscapeKey)
        }
    }, [headerBarRef])

    const handleCreateNew = valid => {
        if (valid) electionMethods.createNew()
    }

    const clickSearchButton = () => {
        setIsSearching(true)
    }

    const closeSearch = () => {
        setIsSearching(false)
    }

    const handleSearchChange = e => {
        setSearchValue(e.target.value)
        onDone({ valid: true, value: e.target.value })
    }

    const renderSearchBar = () => {
        // todo
        return (
            <>
                <input autoFocus type={'text'} value={searchValue} onChange={handleSearchChange} ref={searchInputRef} />
                <MagnifyingGlassSVG
                    className={cx(classes.svg, isSearching ? classes.searchIcon : classes.searchButton)}
                />
            </>
        )
    }

    return (
        <div className={cx(className, classes.undebatesHeader)} style={style} ref={headerBarRef}>
            <UndebateLogoSVG className={classes.logo} />
            <div className={classes.buttonGroup}>
                {isSearching ? (
                    renderSearchBar()
                ) : (
                    <MagnifyingGlassSVG className={cx(classes.svg, classes.searchButton)} onClick={clickSearchButton} />
                )}
                <InstructionsButton className={classes.svg} />
                {user && <SubmitButton name='Create New' onDone={handleCreateNew} />}
                <UserOrSignup user={user} destination={destination} />
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
    searchButton: {
        cursor: 'pointer',
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
    '@media screen and (max-width: 48rem)': {
        undebatesHeader: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            marginRight: '0',
        },
        buttonGroup: {
            flexDirection: 'column',
        },
    },
}))
