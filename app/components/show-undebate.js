import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import QRCode from 'qrcode.react'
import SvgClipboard from '../svgr/clipboard'
import SvgExternalLink from '../svgr/external-link'
import SvgRedo from '../svgr/redo-arrow'
import SvgQrIcon from '../svgr/qr-undebate'
import Submit from './submit'
import { kebabCase } from 'lodash'

const CopyNotification = ({ classes, notify }) => (
    <div className={notify}>
        <div className={classes.innerNotify}>
            <p>Copied to clipboard</p>
            <SvgClipboard className={classes.clipIcon} />
        </div>
    </div>
)

function CopyButton(props) {
    const { src } = props
    const [copied, setCopied] = useState(false)
    const classes = useStylesCopyButton()
    const copyNotify = () => {
        navigator.clipboard.writeText(src)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }
    return (
        <>
            {copied && <CopyNotification classes={classes} notify={classes.notif} key='clip' />}
            <button
                className={cx(classes.copyButton, !src && classes.iconDisabled)}
                onClick={copyNotify}
                title='Copy'
                disabled={!src}
                key='copy'
            >
                <SvgClipboard className={cx(classes.clipIcon, !src && classes.iconDisabled)} />
            </button>
        </>
    )
}

export function CopySubmit(props) {
    const { src } = props
    const [copied, setCopied] = useState(false)
    const classes = useStylesCopyButton()
    const copyNotify = () => {
        navigator.clipboard.writeText(src)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }
    return (
        <>
            {copied && <CopyNotification classes={classes} notify={classes.notifSubmit} key='clip' />}
            <Submit title='Copy' disabled={!src} name='Copy Link' onDone={copyNotify} />
        </>
    )
}

const useStylesCopyButton = createUseStyles(theme => ({
    qrButton: {
        fontSize: '2.2rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        '& rect': {
            fill: theme.colorLightGray,
        },
    },
    copyButton: {
        fontSize: '2.2rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        '& path': {
            fill: 'black!important',
        },
    },
    iconDisabled: {
        '& path': {
            fill: 'gray!important',
        },
        '& g path': {
            stroke: 'gray!important',
            fill: 'none',
        },
    },
    notif: {
        position: 'absolute',
        bottom: '2em',
        right: '2em',
    },
    notifSubmit: {
        position: 'absolute',
        transform: 'translateX(-100%)',
    },
    innerNotify: {
        fontSize: '1rem',
        backgroundColor: theme.colorPrimary,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        borderRadius: '.75rem',
        padding: '1rem',
        fontWeight: '500',
    },
    clipIcon: {
        width: '2rem',
        height: '2rem',
    },
}))

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
const QrButton = props => {
    const { src, fileName } = props
    const [download, setDownload] = useState(false)
    const classes = useStylesCopyButton()
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
    const { src } = props
    const [download, setDownload] = useState(false)
    const classes = useStylesCopyButton()
    return (
        <>
            {download && (
                <ShowAndDownloadQrCode
                    src={src}
                    classes={classes}
                    notify={classes.notifSubmit}
                    key='show-qr'
                    setDownload={setDownload}
                />
            )}
            <Submit title='Download QR Code' name='Download QR Code' disabled={!src} onDone={() => setDownload(true)} />
        </>
    )
}

export default function ShowUndebate(props) {
    const {
        src,
        dependents,
        missed,
        title,
        description,
        buttons = { qr: true, copy: true, redo: true, link: true },
    } = props
    const classes = useStyles(props)
    const iframeRef = useRef()
    // if the recorder is updated, the url doesn't change so the iframe would never refresh - so update the iframe any time there's a change in dependents
    useEffect(() => {
        if (iframeRef.current) iframeRef.current.src += ''
    }, dependents)
    return (
        <div className={cx(classes.showUndebate, { [classes.backgroundRed]: missed })}>
            <div className={classes.outer}>
                <div className={classes.inner}>
                    {src ? (
                        <iframe
                            style={{ position: 'absolute', top: 0 }}
                            ref={iframeRef}
                            width={'100%'}
                            height={'100%'}
                            src={src}
                            frameBorder='0'
                            key='iframe'
                        />
                    ) : (
                        <div ref={iframeRef} className={classes.preview} key='empty-div' />
                    )}
                </div>
            </div>
            <div className={classes.meta} key='meta'>
                <div className={classes.metaText}>
                    <p className={cx(classes.title, { [classes.colorWhite]: missed })}>{title}</p>
                    <p className={cx(classes.desc, { [classes.colorLightRed]: missed })}>{description}</p>
                </div>
                <div className={classes.metaButtons}>
                    {buttons.qr && (
                        <>
                            <QrButton src={src} fileName={'qr-' + kebabCase(title) + '.png'} key='qr' />{' '}
                        </>
                    )}
                    {buttons.copy && (
                        <>
                            <CopyButton src={src} key='cp' />{' '}
                        </>
                    )}
                    {buttons.redo && (
                        <>
                            <button
                                className={cx(classes.redo, !src && classes.iconDisabled)}
                                onClick={e => (iframeRef.current.src += '')}
                                title='Restart'
                                disabled={!src}
                                key='redo'
                            >
                                <SvgRedo />
                            </button>{' '}
                        </>
                    )}
                    {buttons.link ? (
                        src ? (
                            <a href={src} target='_blank' title='Open in new tab' key='link-a'>
                                <SvgExternalLink className={classes.link} />
                            </a>
                        ) : (
                            <button className={classes.disabledlink} title='Open in new tab' disabled key='link-b'>
                                <SvgExternalLink />
                            </button>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    showUndebate: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colorLightGray,
        padding: '.5rem',
        borderRadius: '0.625rem',
        boxSizing: 'border-box',
    },
    outer: {
        width: '100%',
    },
    inner: {
        paddingTop: (1080 * 100) / 1920 + '%',
        position: 'relative',
    }, // paddingTop percentage references width! thanks to: https://makandracards.com/makandra/45969-how-to-define-height-of-a-div-as-percentage-of-its-variable-width
    title: {
        paddingTop: '.5rem',
        paddingLeft: '.5rem',
        margin: '0',
        fontWeight: '500',
    },
    desc: {
        padding: '0',
        margin: '0',
        color: theme.colorGray,
        fontSize: '0.875rem',
        paddingLeft: '.5rem',
        paddingBottom: '.5rem',
    },
    backgroundRed: {
        backgroundColor: theme.colorWarning,
    },
    colorWhite: {
        color: 'white',
    },
    colorLightRed: {
        color: theme.colorLightRed,
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    metaText: {},
    metaButtons: {
        fontSize: '2.5rem',
        marginTop: '.5rem',
        verticalAlign: 'middle',
        position: 'relative',
    },
    redo: {
        fontSize: '2.2rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },
    link: {
        '& path': {
            stroke: 'black',
            strokeWidth: 3,
        },
    },
    disabledlink: {
        padding: 0,
        border: 'none',
        fontSize: '2.5rem',
        cursor: 'pointer',
        '& path': {
            stroke: 'gray',
            strokeWidth: 3,
        },
        backgroundColor: 'transparent',
    },
    iconDisabled: {
        '& path': {
            fill: 'gray',
        },
        '& g path': {
            stroke: 'gray',
            fill: 'none',
        },
    },
    preview: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
}))
