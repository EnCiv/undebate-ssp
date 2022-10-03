// https://github.com/EnCiv/undebate-ssp/issues/44
'use-strict'

import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionTextInput from './election-text-input'
import DoneLockedButton from './done-locked-button'
import isUrl from 'is-url'

const items = [
    { name: 'Organization Name', key: 'organizationName', type: 'text' },
    { name: 'Organization URL', key: 'organizationUrl', type: 'url' },
    { name: 'Organization Logo (URL or Upload) - Optional', key: 'organizationLogo', type: 'url', optional: true },
    { name: 'Election Name', key: 'electionName', type: 'text' },
    { name: 'Election Contact Name', key: 'name', type: 'text' },
    { name: 'Election Contact Email', key: 'email', type: 'email' },
]
const panelName = 'Election'

export default function ElectionComponent(props) {
    const { className, style, electionOM, onDone } = props
    const [electionObj, electionMethods] = electionOM
    const [logoURL, setLogoURL] = useState(electionObj['organizationLogo'] || null)
    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {})
    const allValid =
        Object.values(validInputs).length > 0 &&
        items.every(i => (i.optional && electionObj[i.key] === '') || validInputs[i.key])
    const classes = useStyles()

    // side effects to do after the component rerenders from a state change
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })

    const disabled =
        electionObj?.doneLocked?.[panelName]?.done || electionMethods.getModeratorSubmissionStatus() === 'submitted'

    const submitUploadedLogo = files => {
        const getBase64 = (file, callback) => {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => callback(reader.result)
        }
        getBase64(files[0], image =>
            window.socket.emit('cloudinary-upload', image, res => {
                const key = 'organizationLogo'
                if (res.url) {
                    setLogoURL(res.url)
                    if (electionObj[key] !== res.url) {
                        sideEffects.push(() => electionMethods.upsert({ [key]: res.url }))
                    }
                    setLogoURL(res.url)
                    setValidInputs({ [key]: isUrl(res.url) })
                }
            })
        )
    }

    const orgLogo = (name, key, type) => {
        return (
            <>
                {logoURL && (
                    <div className={cx(className, classes.header)} style={style}>
                        <label htmlFor={name} className={classes.label}>
                            {name}
                        </label>
                        <div className={classes.imgDiv}>
                            <img src={logoURL} />
                            <button
                                className={classes.editButton}
                                disabled={disabled}
                                onClick={() => {
                                    electionMethods.upsert({ [key]: null })
                                    setLogoURL(null)
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                )}
                <ElectionTextInput
                    key={key}
                    name={name}
                    type={type}
                    disabled={disabled || logoURL}
                    style={logoURL ? { display: 'none' } : {}}
                    className={classes.input}
                    defaultValue={electionObj[key] || ''}
                    onDone={({ valid, value }) => {
                        if (electionObj[key] !== value) {
                            sideEffects.push(() => electionMethods.upsert({ [key]: value }))
                        }
                        setLogoURL(value)
                        setValidInputs({ [key]: valid })
                    }}
                />
                <div className={classes.fileInput}>
                    <input
                        disabled={disabled || logoURL}
                        style={logoURL ? { display: 'none' } : {}}
                        name='file'
                        type='file'
                        accepts='image/*'
                        onChange={e => submitUploadedLogo(e.target.files)}
                    />
                </div>
            </>
        )
    }

    return (
        <div className={cx(className, classes.page)} style={style}>
            <div className={cx(className, classes.wrapper)} style={style}>
                {items.map(({ name, key, type }) =>
                    key === 'organizationLogo' ? (
                        orgLogo(name, key, type)
                    ) : (
                        <ElectionTextInput
                            key={key}
                            name={name}
                            type={type}
                            disabled={disabled}
                            className={classes.input}
                            defaultValue={electionObj[key] || ''}
                            onDone={({ valid, value }) => {
                                if (electionObj[key] !== value) {
                                    sideEffects.push(() => electionMethods.upsert({ [key]: value }))
                                }
                                setValidInputs({ [key]: valid })
                            }}
                        />
                    )
                )}
            </div>
            <span className={classes.submitContainer}>
                <DoneLockedButton
                    className={classes.submitButton}
                    electionOM={electionOM}
                    panelName={panelName}
                    isValid={allValid}
                    isLocked={electionMethods.getModeratorSubmissionStatus() === 'submitted'}
                    onDone={({ valid, value }) => valid && onDone({ valid: allValid })}
                />
            </span>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    page: {
        position: 'relative',
    },
    wrapper: {
        width: '38em',
    },
    input: {
        marginTop: '2rem',
        '&:first-child': {
            marginTop: 0,
        },
    },
    label: {
        margin: '0 0.625rem',
        fontWeight: '600',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.625rem',
        paddingTop: '2rem',
    },
    imgDiv: {
        position: 'relative',
        textAlign: 'center',
        marginLeft: '1rem',
        '& img': {
            height: '4.9rem',
            width: 'auto',
            position: 'relative',
        },
        '& button': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: '0',
        },
        '&:hover': {
            '& img': { filter: 'blur(2px)' },
            '& button': {
                opacity: '1',
            },
        },
    },
    editButton: {
        border: 'none',
        padding: 0,
        background: 'none',
        fontWeight: theme.button.fontWeight,
        lineHeight: '2rem',
        fontSize: theme.button.fontSize,
    },
    fileInput: {
        marginLeft: '.6rem',
        '& input[type="file"]::file-selector-button': {
            borderRadius: theme.button.borderRadius,
            borderColor: theme.button.borderColor,
            fontSize: theme.button.fontSize,
            fontWeight: 400,
            fontFamily: theme.button.fontFamily,
            lineHeight: '0.75rem',
        },
    },
    submitContainer: { position: 'absolute', width: '35%', padding: 0, top: 0, right: 0 },
    submitButton: { float: 'right' },
}))
