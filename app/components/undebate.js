// https://github.com/EnCiv/undebate-ssp/issue/57

import React, { useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import QRCode from 'qrcode.react'
import VideoUpload from '../svgr/video-upload'
import Submit from './submit'

export default function Undebate(props) {
    const { className, style, electionOM } = props
    const classes = useStyles(props)
    const [electionObj] = electionOM
    const { undebate } = electionObj
    const { url } = undebate
    const canvas = useRef(null)

    const downloadCode = () => {
        const image = canvas.current.children[0].toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = image
        downloadLink.download = 'undebate.png'
        downloadLink.click()
    }

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <div className={classes.qrcode}>
                <div className={classes.code} ref={canvas}>
                    <QRCode value={url} size={300} />
                </div>
                <div className={classes.buttons}>
                    <Submit name='Copy Link' onDone={() => navigator.clipboard.writeText(url)} />
                    <Submit name='Download QR Code' onDone={downloadCode} />
                </div>
            </div>
            <VideoUpload className={classes.upload} />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    qrcode: {
        background: 'rgba(116, 112, 255, 0.25)',
        margin: '1rem',
        borderRadius: '1rem',
        paddingBottom: '1.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    },
    code: {
        background: '#fff',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem',
        marginBottom: '1rem',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        borderRadius: '1rem',
    },
    buttons: {
        display: 'flex',
        gap: '1rem',
    },
    upload: {
        height: '31.25rem',
        width: '22.5rem',
        alignSelf: 'flex-end',
    },
}))
