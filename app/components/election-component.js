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
        getBase64(files[0], image => {
            const type = electionObj['id'] + '-logo'
            window.socket.emit('cloudinary-upload', { file: image, type: type }, res => {
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
        })
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
                                className={cx(className, classes.button, disabled && classes.disabledButton)}
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
                <div className={classes.orgLogoDiv}>
                    <ElectionTextInput
                        key={key}
                        name={name}
                        type={type}
                        disabled={disabled || logoURL}
                        style={
                            logoURL
                                ? { display: 'none', width: '75%', marginRight: '0' }
                                : { width: '75%', marginRight: '0', padding: 'none' }
                        }
                        className={cx(className, classes.input, classes.inputAdd)}
                        defaultValue={electionObj[key] || ''}
                        onDone={({ valid, value }) => {
                            if (electionObj[key] !== value) {
                                sideEffects.push(() => electionMethods.upsert({ [key]: value }))
                            }
                            setLogoURL(value)
                            setValidInputs({ [key]: valid })
                        }}
                    />
                    {!logoURL && (
                        <div className={classes.fileInput}>
                            <label
                                for='file-upload'
                                className={cx(
                                    className,
                                    classes.button,
                                    classes.labelButton,
                                    disabled && classes.disabledButton
                                )}
                            >
                                Choose File to Upload
                            </label>
                            <input
                                id='file-upload'
                                disabled={disabled || logoURL}
                                style={logoURL ? { display: 'none' } : {}}
                                name='file'
                                type='file'
                                accepts='image/*'
                                onChange={e => submitUploadedLogo(e.target.files)}
                            />
                        </div>
                    )}
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
    inputAdd: {
        gap: '0.625rem',
        paddingTop: '2rem',
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
    orgLogoDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    imgDiv: {
        position: 'relative',
        textAlign: 'center',
        marginLeft: '1rem',
        '& img': {
            height: '3.5rem',
            width: 'auto',
            position: 'relative',
        },
        '& button': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.6)',
            opacity: '0',
        },
        '&:hover': {
            '& img': { filter: 'blur(2px)' },
            '& button': {
                opacity: '1',
            },
        },
    },
    fileInput: {
        position: 'relative',
        marginLeft: '.6rem',
        marginBottom: '3rem',
        '& input[type="file"]': {
            position: 'absolute',
            display: 'none',
        },
    },
    button: {
        ...theme.button,
        backgroundColor: theme.colorPrimary,
        border: 'none',
        color: '#FFF',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    labelButton: {
        marginTop: '3.75rem',
        width: '6rem',
        textAlign: 'center',

        position: 'absolute',
        transform: 'scale(.7)',
    },
    disabledButton: {
        backgroundColor: theme.colorGray,
        opacity: theme.disabledOpacity,
        color: '#fff',
        '&:hover': {
            cursor: 'not-allowed',
        },
    },
    submitContainer: { position: 'absolute', width: '35%', padding: 0, top: 0, right: 0 },
    submitButton: { float: 'right' },
}))
