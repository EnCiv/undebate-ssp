import React, { useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import SvgExternalLink from '../svgr/external-link'
import SvgRedo from '../svgr/redo-arrow'
import cx from 'classnames'

function reactOnResize(handler, dependents) {
    useEffect(() => {
        window.addEventListener('resize', handler)
        handler()
        return () => window.removeEventListener('resize', handler)
    }, dependents)
}

export default function ShowUndebate(props) {
    const { src, dependents, missed, title, description } = props
    const classes = useStyles(props)
    const iframeRef = useRef()
    // if the recorder is updated, the url doesn't change so the iframe would never refresh - so update the iframe any time there's a change in dependents
    useEffect(() => {
        if (iframeRef.current) iframeRef.current.src += ''
    }, dependents)
    function doResize() {
        if (iframeRef.current) {
            iframeRef.current.style.height = (iframeRef.current.offsetWidth * 1080) / 1920 + 'px'
            iframeRef.current.src += '' // force rerender so it will calculate new fontsize
        }
    }
    reactOnResize(doResize, [iframeRef.current]) // current could chagne when changing from div to iframe
    return (
        <div className={cx(classes.showUndebate, { [classes.backgroundRed]: missed })}>
            {src ? (
                <iframe ref={iframeRef} width={'100%'} src={src} frameBorder='0' key='iframe' />
            ) : (
                <div ref={iframeRef} className={classes.preview} key='empty-div' />
            )}
            <div className={classes.meta} key='meta'>
                <div className={classes.metaText}>
                    <p className={cx(classes.title, { [classes.colorWhite]: missed })}>{title}</p>
                    <p className={cx(classes.desc, { [classes.colorLightRed]: missed })}>{description}</p>
                </div>
                <div className={classes.metaButtons}>
                    <button
                        className={cx(classes.redo, !src && classes.iconDisabled)}
                        onClick={e => (iframeRef.current.src += '')}
                        title='Restart'
                        disabled={!src}
                    >
                        <SvgRedo />
                    </button>{' '}
                    {src ? (
                        <a href={src} target='_blank' title='Open in new tab'>
                            <SvgExternalLink className={classes.link} />
                        </a>
                    ) : (
                        <button className={classes.disabledlink} title='Open in new tab' disabled>
                            <SvgExternalLink />
                        </button>
                    )}
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
        backgroundColor: 'white',
    },
}))
