import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgExternalLink from '../svgr/external-link'
import SvgRedo from '../svgr/redo-arrow'
import { kebabCase } from 'lodash'
import { QrButton, CopyButton } from './undebate-buttons'

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
                            <button className={classes.linkDisabled} title='Open in new tab' disabled key='link-b'>
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
        '&$iconDisabled': {
            cursor: 'not-allowed',
            '& path': {
                fill: 'gray',
            },
        },
    },
    link: {
        '& path': {
            stroke: 'black',
            strokeWidth: 3,
        },
    },
    linkDisabled: {
        padding: 0,
        border: 'none',
        fontSize: '2.5rem',
        cursor: 'not-allowed',
        '& path': {
            stroke: 'gray',
            strokeWidth: 3,
        },
        backgroundColor: 'transparent',
    },
    iconDisabled: {},
    preview: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
}))
