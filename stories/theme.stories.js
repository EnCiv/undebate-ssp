import { createUseStyles } from 'react-jss'
import React from 'react'
export default {
    title: 'Theme Examples',
}

const Template = args => {
    const classes = args.useStylesFromThemeFunction()
    return Object.keys(classes).map(className => {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ textAlign: 'center', margin: '1rem' }} className={classes[className]}>
                    {className}
                </div>
            </div>
        )
    })
}

export const Colors = Template.bind({})
Colors.args = {
    useStylesFromThemeFunction: createUseStyles(theme => ({
        colorPrimary: {
            padding: theme.buttonPadding,
            background: theme.colorPrimary,
        },
        colorSecondary: {
            padding: theme.buttonPadding,
            background: theme.colorSecondary,
        },
        colorWarning: {
            padding: theme.buttonPadding,
            background: theme.colorWarning,
        },
        colorSuccess: {
            padding: theme.buttonPadding,
            background: theme.colorSuccess,
        },
        backgroundColorApp: {
            padding: theme.buttonPadding,
            background: theme.backgroundColorApp,
        },
        backgroundColorWarning: {
            padding: theme.buttonPadding,
            background: theme.backgroundColorWarning,
        },
        backgroundColorComponent: {
            padding: theme.buttonPadding,
            background: theme.backgroundColorComponent,
        },
        disabledOpacity: {
            padding: theme.buttonPadding,
            background: theme.colorPrimary,
            opacity: theme.disabledOpacity,
        },
        normalTextOpacity: {
            padding: theme.buttonPadding,
        },
        secondaryTextOpacity: {
            padding: theme.buttonPadding,
            opacity: theme.secondaryTextOpacity,
        },
    })),
}

export const Sizes = Template.bind({})
Sizes.args = {
    useStylesFromThemeFunction: createUseStyles(theme => ({
        buttonBorderRadius: {
            borderRadius: theme.buttonBorderRadius,
            background: theme.colorPrimary,
            padding: '1rem',
        },
        defaultBorderRadius: {
            borderRadius: theme.defaultBorderRadius,
            background: theme.colorPrimary,
            padding: '1rem',
        },
        iconSize: {
            background: theme.colorPrimary,
            width: theme.iconSize,
            height: theme.iconSize,
        },
        inputFieldPadding: {
            background: theme.colorPrimary,
            padding: theme.inputFieldPadding,
        },
        buttonPadding: {
            background: theme.colorPrimary,
            padding: theme.buttonPadding,
        },
        headerFontSize: {
            fontSize: theme.headerFontSize,
        },
        defaultFontSize: {
            fontSize: '1rem',
        },
        secondaryTextFontSize: {
            fontSize: theme.secondaryTextFontSize,
        },
    })),
}
