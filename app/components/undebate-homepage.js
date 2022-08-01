// https://github.com/EnCiv/undebate-ssp/issue/20
import React, { useState, useMemo, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import UndebatesList from './undebates-list'
import ElectionHeader from './election-header'
import SubscribeElectionInfo from './subscribe-election-info'
import UndebatesHeaderBar from './undebates-header-bar'
import UndebatesLandingPage from './undebates-landing-page'

export default function UndebateHomepage(props) {
    const { className, style, user } = props
    const [electionObjs, setElectionObjs] = useState([])
    const classes = useStyles(props)
    const [selectedId, setSelectedId] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const index = selectedId ? electionObjs.findIndex(eObj => eObj.id === selectedId) : -1
    const electionNames = useMemo(() => electionObjs.map(obj => obj.electionName), [electionObjs])
    useEffect(() => {
        window.socket.emit('get-election-docs', objs => objs && setElectionObjs(objs))
    }, [])
    const createNew = () => {
        window.socket.emit('create-election-doc', id => {
            if (!id) return
            setSelectedId(id)
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
                        className={classes.header}
                        user={user}
                        onDone={({ valid, value }) =>
                            setSelectedId(electionObjs.find(obj => obj.electionName === electionNames[value]).id)
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
                            <UndebatesList
                                electionObjs={electionObjs}
                                onDone={({ value, valid }) => setSelectedId(value)}
                                globalFilter={searchValue}
                                key='list'
                            />
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
