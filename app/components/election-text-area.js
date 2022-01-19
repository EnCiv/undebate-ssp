import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'

const validText = (text, max = 400) =>
    text
        .trim()
        .split(' ')
        .filter(word => word !== '' && word !== '\n').length <= max

export default function ElectionTextArea(props) {
    const {
        name = 'Invitation greeting',
        onDone,
        defaultValue,
        maxWords,
        description = 'This would be included in the invite email for the moderator. Not more than 400 words.',
    } = props
    const classes = useStyles()
    useEffect(() => {
        if (onDone) onDone({ valid: validText(defaultValue, maxWords), value: defaultValue })
    }, [defaultValue]) // initiall report if default value is valid or not
    return (
        <label className={classes.label}>
            {name}
            <div className={classes.instruction}>
                <span className={classes.desc}>{description}</span>
            </div>
            <TextareaAutosize
                onBlur={e => {
                    const { value } = e.target
                    if (onDone) onDone({ valid: validText(value, maxWords), value })
                }}
                className={classes.textarea}
                name={name}
                minRows={12}
                defaultValue={defaultValue}
            />
        </label>
    )
}

const useStyles = createUseStyles(theme => ({
    label: {
        margin: '0 0.625rem',
        fontWeight: '600',
    },
    instruction: {
        marginBottom: '2rem',
    },
    desc: {
        margin: '.3rem 0rem 0.625rem 0rem',
        fontSize: theme.secondaryTextFontSize,
        color: theme.colorSecondary,
        opacity: theme.secondaryTextOpacity,
    },
    textarea: {
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: theme.defaultBorderRadius,
        backgroundColor: theme.backgroundColorComponent,
        padding: theme.inputFieldPadding,
        border: 'none',
        fontSize: theme.inputFieldFontSize,
        fontFamily: theme.defaultFontFamily,
    },
}))
