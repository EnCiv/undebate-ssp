// https://github.com/EnCiv/undebate-ssp/issue/57

import React, { useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import VideoUpload from '../svgr/video-upload'
import scheme from '../lib/scheme'
import { getLatestIota } from '../lib/get-election-status-methods'
import ShowUndebate from './show-undebate'
import { QrSubmit, CopySubmit } from './undebate-buttons'
import { kebabCase } from 'lodash'

export default function Undebate(props) {
    const { className, style, electionOM } = props
    const classes = useStyles(props)
    const [electionObj = {}, electionMethods] = electionOM
    const firstOffice = Object.values(electionObj?.offices || {})?.[0]
    const viewer = getLatestIota(firstOffice?.viewers)
    const src = viewer ? scheme() + process.env.HOSTNAME + viewer.path : ''
    const title = electionObj.electionName
    const description = src ? 'Link is ready' : 'link is not ready'

    return (
        <div className={cx(className, classes.undebate)} style={style}>
            <div className={classes.innerLeft}>
                <p>
                    This is the viewer of the undebate. It's best to wait until all the candidates have recorded, before
                    sending out the link. You can copy the link, and/or you can download a QR Code that will direct
                    people to the link.
                </p>
                <div className={classes.wrapper}>
                    <ShowUndebate
                        src={src}
                        dependents={[electionOM]}
                        key='show'
                        title={title}
                        description={description}
                    />
                    {!src && <VideoUpload className={classes.upload} key='up' />}
                </div>
            </div>
            <div className={classes.buttonPanel}>
                <div className={classes.buttonRow}>
                    <CopySubmit src={src} />
                </div>
                <div className={classes.buttonRow}>
                    <QrSubmit src={src} fileName={'qr-' + kebabCase(title) + '.png'} />
                </div>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    undebate: {
        backgroundColor: theme.backgroundColorApp,
        width: 'auto',
        display: 'flex',
    },
    innerLeft: {
        position: 'relative',
        width: '75%',
        maxWidth: '60rem',
        float: 'left',
        '& p': {
            marginBlockStart: 0,
        },
    },
    buttonPanel: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '1rem',
        flexGrow: 1,
    },
    buttonRow: {
        marginBottom: '2rem',
        textAlign: 'right',
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    upload: {
        position: 'absolute',
        height: '50%',
        width: '50%',
        paddingBottom: '3rem',
    },
}))
