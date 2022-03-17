// https://github.com/EnCiv/undebate-ssp/issue/57

import React, { useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import QRCode from 'qrcode.react'
import VideoUpload from '../svgr/video-upload'
import Submit from './submit'
import Clipboard from '../svgr/clipboard'

export default function Undebate(props) {
    const { className, style, electionOM } = props
    const classes = useStyles(props)
    const [electionObj] = electionOM
    const { undebate } = electionObj
    const { url } = undebate
    const [copied, setCopied] = useState(false)
    const canvas = useRef(null)

    const downloadCode = () => {
        const image = canvas.current.children[0].toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = image
        downloadLink.download = 'undebate.png'
        downloadLink.click()
    }

    const copyNotify = text => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    const CopyNotification = ({ text, Icon }) => (
        <div className={classes.notif}>
            <p>{text}</p>
            <Icon className={classes.clipIcon} />
        </div>
    )

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            {copied && <CopyNotification Icon={Clipboard} text='Copied to clipboard' />}
            <div className={classes.qrcode}>
                <div className={classes.code} ref={canvas}>
                    <QRCode value={url} size={300} />
                </div>
                <div className={classes.buttons}>
                    <Submit name='Copy Link' onDone={copyNotify} />
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
    notif: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: '3rem',
        backgroundColor: theme.colorPrimary,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        borderRadius: '10px',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '.6rem',
        paddingBottom: '.6rem',
        fontWeight: '500',
    },
    clipIcon: {
        width: '30px',
        height: '30px',
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
