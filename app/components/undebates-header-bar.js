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
        handleSearchChange('')
        setIsSearching(false)
    }

    const handleSearchChange = value => {
        setSearchValue(value)
        onDone({ valid: true, value: value })
    }

    const renderSearchBar = () => {
        return (
            <span className={classes.searchBar}>
                <input
                    autoFocus
                    type={'text'}
                    placeholder={'Search'}
                    value={searchValue}
                    className={classes.searchInput}
                    onChange={e => handleSearchChange(e.target.value)}
                    ref={searchInputRef}
                />
                <MagnifyingGlassSVG
                    className={cx(classes.svg, isSearching ? classes.searchIcon : classes.searchButton)}
                />
            </span>
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
        height: '9.125rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 1rem',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '2rem',
        alignItems: 'center',
    },
    searchBar: {
        backgroundColor: 'white',
        height: '4rem',
        borderRadius: '2rem',
        display: 'flex',
        alignItems: 'center',
    },
    searchInput: {
        marginLeft: '1.5rem',
        border: 'none',
        fontSize: '1.125rem',
        outline: 'none',
        minWidth: '20rem',
        maxWidth: '44rem',
    },
    searchIcon: {
        marginRight: '1.5rem',
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
