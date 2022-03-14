// https://github.com/EnCiv/undebate-ssp/issue/57

import React, { useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import QRCode from 'qrcode.react'
import VideoUpload from '../svgr/video-upload'

export default function Undebate(props) {
    const { className, style, electionOM } = props
    const classes = useStyles(props)
    const [electionObj, electionMethods] = electionOM
    const { undebate } = electionObj
    const { url } = undebate
    const canvas = useRef(null)

    const downloadCode = () => {
        const image = canvas.current.toDataURL('image/png')
    }

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <div className={classes.qrcode}>
                <div className={classes.code}>
                    <QRCode value={url} ref={canvas} />
                </div>
                <div>
                    <Submit name='Copy Link' onDone={() => navigator.clipboard.writeText(url)} />
                    <Submit name='Download QR Code' onDone={downloadCode} />
                </div>
            </div>
            <VideoUpload />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
}))
