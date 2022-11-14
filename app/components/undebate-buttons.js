import React, { useRef, useState, useLayoutEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import QRCode from 'qrcode.react'
import SvgClipboard from '../svgr/copy'
import SvgQrIcon from '../svgr/qr-undebate'
import Submit from './submit'

const NOTIFY_TIME = 3000

function CopyNotification(props) {
    const { classes, notify } = props
    return (
        <div className={notify}>
            <div className={classes.innerNotify}>
                <p>Copied to clipboard</p>
                <SvgClipboard />
            </div>
        </div>
    )
}
const copyNotify = (src, setCopied) => {
    navigator.clipboard.writeText(src)
    setCopied(true)
    setTimeout(() => {
        setCopied(false)
    }, NOTIFY_TIME)
}

export function CopyButton(props) {
    const { src } = props
    const [copied, setCopied] = useState(false)
    const classes = useStyles()
    return (
        <>
            {copied && <CopyNotification classes={classes} notify={classes.notif} key='clip' />}
            <button
                className={cx(classes.copyButton, !src && classes.iconDisabled)}
                onClick={() => copyNotify(src, setCopied)}
                title='Copy'
                disabled={!src}
                key='copy'
            >
                <SvgClipboard className={cx(!src && classes.iconDisabled)} />
            </button>
        </>
    )
}

export function CopySubmit(props) {
    const { src } = props
    const [copied, setCopied] = useState(false)
    const classes = useStyles()
    return (
        <>
            {copied && <CopyNotification classes={classes} notify={classes.notifSubmit} key='clip' />}
            <Submit title='Copy' disabled={!src} name='Copy Link' onDone={() => copyNotify(src, setCopied)} />
        </>
    )
}

const downloadCode = (canvas, fileName) => {
    const image = canvas.current.children[0].toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = image
    downloadLink.download = fileName || 'undebate.png'
    downloadLink.click()
}

const ShowAndDownloadQrCode = props => {
    const { classes, src, setDownload, notify, fileName } = props
    const canvas = useRef()
    useLayoutEffect(() => downloadCode(canvas, fileName))
    setTimeout(() => setDownload(false), 3000)
    return (
        <div className={notify} ref={canvas} key='qrqr'>
            <QRCode className={classes.innerNotify} value={src} size={300} />
        </div>
    )
}
export function QrButton(props) {
    const { src, fileName } = props
    const [download, setDownload] = useState(false)
    const classes = useStyles()
    return (
        <>
            {download && (
                <ShowAndDownloadQrCode
                    src={src}
                    classes={classes}
                    notify={classes.notif}
                    key='show-qr'
                    setDownload={setDownload}
                    fileName={fileName}
                />
            )}
            <button
                className={cx(classes.qrButton, !src && classes.iconDisabled)}
                onClick={() => setDownload(true)}
                title='Download QR Code'
                disabled={!src}
                key='download'
            >
                <SvgQrIcon className={cx(!src && classes.iconDisabled)} />
            </button>
        </>
    )
}

export function QrSubmit(props) {
    const { src, fileName } = props
    const [download, setDownload] = useState(false)
    const classes = useStyles()
    return (
        <>
            {download && (
                <ShowAndDownloadQrCode
                    src={src}
                    classes={classes}
                    notify={classes.notifSubmit}
                    key='show-qr'
                    setDownload={setDownload}
                    fileName={fileName}
                />
            )}
            <Submit title='Download QR Code' name='Download QR Code' disabled={!src} onDone={() => setDownload(true)} />
        </>
    )
}

const useStyles = createUseStyles(theme => ({
    qrButton: {
        fontSize: '2.2rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        '& rect': {
            fill: 'none',
        },
        '&$iconDisabled path': {
            fill: 'gray',
        },
    },
    copyButton: {
        fontSize: '2.2rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        '&$iconDisabled path': {
            stroke: 'gray',
            fill: 'none',
        },
    },
    iconDisabled: {
        cursor: 'not-allowed',
    },
    // position is hard coded for show-undebate.js
    notif: {
        position: 'absolute',
        bottom: '2em',
        right: '2em',
    },
    // position is hard coded for undebate.js
    notifSubmit: {
        position: 'absolute',
        transform: 'translateX(-100%)',
    },
    innerNotify: {
        fontSize: '2rem',
        backgroundColor: theme.colorPrimary,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        borderRadius: '.75rem',
        padding: '1rem',
        fontWeight: '500',
        '& p': {
            margin: 0,
        },
        '& svg': {
            fontSize: '200%',
        },
    },
}))
