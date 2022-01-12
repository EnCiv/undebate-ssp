import { createUseStyles } from 'react-jss'
export default {
    title: 'Theme Examples',
}

const Template = args => {
    const classes = args.useStylesFromThemeFunction()
    return Object.keys(classes).map(className => {
        return (
            <div style={{ textAlign: 'center', margin: '1rem' }} className={classes[className]}>
                {className}
            </div>
        )
    })
}

export const Colors = Template.bind({})
Colors.args = {
    useStylesFromThemeFunction: createUseStyles(theme => ({
        colorPrimary: {
            background: theme.colorPrimary,
        },
        colorSecondary: {
            background: theme.colorSecondary,
        },
        colorWarning: {
            background: theme.colorWarning,
        },
        colorSuccess: {
            background: theme.colorSuccess,
        },
        backgroundColorApp: {
            background: theme.backgroundColorApp,
        },
        backgroundColorWarning: {
            background: theme.backgroundColorWarning,
        },
        backgroundColorComponent: {
            background: theme.backgroundColorComponent,
        },
    })),
}

export const BorderRadii = Template.bind({})
BorderRadii.args = {
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
        defaultPadding: {
            borderRadius: theme.defaultBorderRadius,
            background: theme.colorPrimary,
            padding: theme.defaultPadding,
        },
        buttonPadding: {
            borderRadius: theme.defaultBorderRadius,
            background: theme.colorPrimary,
            padding: theme.buttonPadding,
        },
    })),
}
