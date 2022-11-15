import React, { useRef, useState, useLayoutEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import QRCode from 'qrcode.react'
import SvgClipboard from '../svgr/copy'
import SvgQrIcon from '../svgr/qr-undebate'
import Submit from './submit'

//const NOTIFY_TIME = 300000 // for testing
const NOTIFY_TIME = 3000 // for normal use

// turn on a Component, then turn it off after NOTIFY_TIME
function useNotifier(Component) {
    const [showNotifier, setShowNotifier] = useState(false)
    const Notifier = props => (showNotifier ? Component(props) : null)
    const startNotifier = () => {
        setShowNotifier(true)
        setTimeout(() => {
            setShowNotifier(false)
        }, NOTIFY_TIME)
    }
    return [startNotifier, Notifier]
}

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

export function CopyButton(props) {
    const { src } = props
    const classes = useStyles()
    const [startNotifier, Notifier] = useNotifier(CopyNotification)
    return (
        <>
            <Notifier classes={classes} notify={classes.notify} key='clip' />
            <button
                className={cx(classes.copyButton, !src && classes.iconDisabled)}
                onClick={() => navigator.clipboard.writeText(src) && startNotifier()}
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
    const classes = useStyles()
    const [startNotifier, Notifier] = useNotifier(CopyNotification)
    return (
        <>
            <Notifier classes={classes} notify={classes.notifSubmit} key='clip' />
            <Submit
                title='Copy'
                disabled={!src}
                name='Copy Link'
                onDone={() => navigator.clipboard.writeText(src) && startNotifier()}
            />
        </>
    )
}

const downloadCode = (canvas, fileName) => {
    if (!canvas.current) return
    const image = canvas.current.children[0].toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = image
    downloadLink.download = fileName || 'undebate.png'
    downloadLink.click()
}

const ShowAndDownloadQrCode = props => {
    const { classes, src, notify, fileName } = props
    const canvas = useRef()
    useLayoutEffect(() => downloadCode(canvas, fileName))
    return (
        <div className={notify} ref={canvas} key='qrqr'>
            <QRCode className={classes.innerNotify} value={src} size={300} />
        </div>
    )
}

export function QrButton(props) {
    const { src, fileName } = props
    const [startNotifier, Notifier] = useNotifier(ShowAndDownloadQrCode)
    const classes = useStyles()
    return (
        <>
            <Notifier src={src} classes={classes} notify={classes.notify} key='show-qr' fileName={fileName} />
            <button
                className={cx(classes.qrButton, !src && classes.iconDisabled)}
                onClick={startNotifier}
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
    const [startNotifier, Notifier] = useNotifier(ShowAndDownloadQrCode)
    const classes = useStyles()
    return (
        <>
            <Notifier src={src} classes={classes} notify={classes.notifSubmit} key='show-qr' fileName={fileName} />
            <Submit title='Download QR Code' name='Download QR Code' disabled={!src} onDone={startNotifier} />
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
    notify: {
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
