const theme = {
    // UI Colors
    colorPrimary: '#7470FF',
    colorSecondary: '#262D33',
    colorWarning: '#EE6055',
    colorLightRed: '#f3ada7',
    colorSuccess: '#46941B',
    colorGray: '#7d8084',
    colorLightGray: '#d4d5d6',
    colorText: '#262D33',

    // Can be combined with UI colors to create a 'disabled' version
    disabledOpacity: '0.3',

    // Can be applied to text used to add more description to things such as text used to give info about an input field
    secondaryTextOpacity: '0.7',
    secondaryTextFontSize: '0.875rem',

    // Background Colors
    backgroundColorApp: '#ECECEC',
    backgroundColorWarning: 'rgba(238, 96, 85, 0.25)',
    backgroundColorComponent: 'rgba(38, 45, 51, 0.2)',

    // Sizing
    defaultBorderRadius: '0.625rem',
    iconSize: '1.25rem',

    // instead of using these 2 - try using { ...theme.button, from below and override if needed
    buttonPadding: '0.9375rem 1.875rem',
    buttonBorderRadius: '1.875rem',

    button: {
        padding: '0.9375rem 1.875rem',
        borderRadius: '1.875rem',
        borderColor: '#262D331A',
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: 'Poppins',
        lineHeight: '1.25rem', // in figma it's 24/16 but it didn't render the same so this is 20/16
    },
    buttonHoverBackground: '#fec215',

    inputFieldPadding: '1rem 1.25rem',
    inputFieldFontSize: '1.125rem',
    inputFieldLineHeight: '1.6875rem',
    inputFieldBackgroundColor: 'rgba(38, 45, 51, 0.1)',

    // Use for things like Election Header and Section Header
    headerFontSize: '1.125rem',

    //Font
    defaultFontFamily: 'Poppins',

    gap: '1.875rem',

    colorDeclined: '#EE6055',
    colorAccepted: '#46941B',
    colorSubmitted: '#7470FF',
    colorSent: 'rgba(38, 45, 51, 0.2)',
    colorDeadlineMissed: '#FCA105',

    csvPopupHeight: '41.25rem',
    csvPopupWidth: '29.6875rem',
}

export default theme
