// https://github.com/EnCiv/undebate-ssp/issue/20
import React, { useState, useMemo, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import UndebatesList from './undebates-list'
import ElectionHeader from './election-header'
import SubscribeElectionInfo from './subscribe-election-info'
import UndebatesHeaderBar from './undebates-header-bar'
import UndebatesLandingPage from './undebates-landing-page'
import { useSearchParams } from 'react-router-dom'
import Spinner from './spinner'

// using 'eid' as the search param becuase id is taken by storybook and it's easier just to get a long

export default function UndebateHomepage(props) {
    const { className, style, user } = props
    const [electionObjs, setElectionObjs] = useState(null)
    const classes = useStyles(props)
    const [searchValue, setSearchValue] = useState('')
    const electionNames = useMemo(() => (electionObjs ? electionObjs.map(obj => obj.electionName) : []), [electionObjs])
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedId = searchParams.get('eid')
    const index = electionObjs && selectedId ? electionObjs.findIndex(eObj => eObj.id === selectedId) : -1
    useEffect(() => {
        window.socket.emit('get-election-docs', objs => objs && setElectionObjs(objs))
    }, [])
    const createNew = () => {
        window.socket.emit('create-election-doc', id => {
            if (!id) return
            setSearchParams((searchParams.set('eid', id), searchParams))
        })
    }
    return (
        <div className={cx(className, classes.undebateHomePage)} style={style}>
            {/*key below to make sure React creates new component rather than reuse existing which would screw up subscription */}
            {selectedId ? (
                <>
                    <ElectionHeader
                        elections={selectedId ? electionNames : ['Select One']}
                        defaultValue={index}
                        key={index /*so we rerender when it is changed from above*/}
                        className={classes.header}
                        user={user}
                        onDone={({ valid, value }) =>
                            setSearchParams(
                                (searchParams.set(
                                    'eid',
                                    electionObjs.find(obj => obj.electionName === electionNames[value]).id
                                ),
                                searchParams)
                            )
                        }
                    />
                    <SubscribeElectionInfo id={selectedId} key={selectedId} />
                </>
            ) : (
                <>
                    {user ? (
                        <>
                            <UndebatesHeaderBar
                                electionOM={[, { createNew }]}
                                className={classes.header}
                                user={user}
                                onDone={({ valid, value }) => setSearchValue(value)}
                            />
                            {electionObjs ? (
                                <UndebatesList
                                    electionObjs={electionObjs}
                                    onDone={({ value, valid }) =>
                                        setSearchParams((searchParams.set('eid', value), searchParams))
                                    }
                                    globalFilter={searchValue}
                                    key='list'
                                />
                            ) : (
                                <Spinner style={{ minHeight: '70vh' }} />
                            )}
                        </>
                    ) : (
                        <UndebatesLandingPage {...props} />
                    )}
                </>
            )}
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    undebateHomePage: {
        minHeight: '75vh',
        backgroundColor: theme.backgroundColorApp,
        paddingBottom: '2rem',
    },
    header: {},
}))
