import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import QRCode from 'qrcode.react'
import SvgClipboard from '../svgr/clipboard'
import SvgExternalLink from '../svgr/external-link'
import SvgRedo from '../svgr/redo-arrow'
import SvgContainer from '../svgr/container'

const CopyNotification = ({ classes }) => (
    <div className={classes.notif}>
        <p>Copied to clipboard</p>
        <SvgClipboard className={classes.clipIcon} />
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
            {copied && <CopyNotification classes={classes} key='clip' />}
            <button
                className={cx(classes.copyButton, !src && classes.iconDisabled)}
                onClick={copyNotify}
                title='Copy'
                disabled={!src}
                key='copy'
            >
                <SvgClipboard className={cx(!src && classes.iconDisabled)} />
            </button>
        </>
    )
}
const useStylesCopyButton = createUseStyles(theme => ({
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
        fontSize: '1rem',
        position: 'absolute',
        bottom: '2em',
        right: '2em',
        margin: '3rem',
        backgroundColor: theme.colorPrimary,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        borderRadius: '.75rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '.6rem',
        paddingBottom: '.6rem',
        fontWeight: '500',
    },
    clipIcon: {
        width: '2rem',
        height: '2rem',
    },
}))

const downloadCode = canvas => {
    const image = canvas.current.children[0].toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = image
    downloadLink.download = 'undebate.png'
    downloadLink.click()
}

const ShowAndDownloadQrCode = props => {
    const { classes, src, setDownload } = props
    const canvas = useRef()
    useLayoutEffect(() => downloadCode(canvas))
    setTimeout(() => setDownload(false), 3000)
    return (
        <div className={classes.notif} ref={canvas} key='qrqr'>
            <QRCode value={src} size={300} />
        </div>
    )
}
const QrButton = props => {
    const { src } = props
    const [download, setDownload] = useState(false)
    const classes = useStylesCopyButton()
    return (
        <>
            {download && <ShowAndDownloadQrCode src={src} classes={classes} key='show-qr' setDownload={setDownload} />}
            <button
                className={cx(classes.copyButton, !src && classes.iconDisabled)}
                onClick={() => setDownload(true)}
                title='Download QR Code'
                disabled={!src}
                key='download'
            >
                <SvgContainer className={cx(!src && classes.iconDisabled)} />
            </button>
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
                            <QrButton src={src} />{' '}
                        </>
                    )}
                    {buttons.copy && (
                        <>
                            <CopyButton src={src} />{' '}
                        </>
                    )}
                    {buttons.redo && (
                        <>
                            <button
                                className={cx(classes.redo, !src && classes.iconDisabled)}
                                onClick={e => (iframeRef.current.src += '')}
                                title='Restart'
                                disabled={!src}
                            >
                                <SvgRedo />
                            </button>{' '}
                        </>
                    )}
                    {buttons.link ? (
                        src ? (
                            <a href={src} target='_blank' title='Open in new tab'>
                                <SvgExternalLink className={classes.link} />
                            </a>
                        ) : (
                            <button className={classes.disabledlink} title='Open in new tab' disabled>
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
