import { createUseStyles } from 'react-jss'
export default function FontFaces(props) {
    useStyles()
    return props.children
}

const useStyles = createUseStyles({
    '@font-face': [
        {
            fontFamily: 'Poppins',
            src: `url(/assets/fonts/Poppins/Poppins-Thin.ttf)`,
            fontWeight: 100,
        },
        {
            fontFamily: 'Poppins',
            src: `url(/assets/fonts/Poppins/Poppins-ExtraLight.ttf)`,
            fontWeight: 200,
        },
        {
            fontFamily: 'Poppins',
            src: `url(/assets/fonts/Poppins/Poppins-Light.ttf)`,
            fontWeight: 300,
        },
        {
            fontFamily: 'Poppins',
            src: `url(/assets/fonts/Poppins/Poppins-Regular.ttf)`,
            fontWeight: 400,
        },
        {
            fontFamily: 'Poppins',
            src: `url(/assets/fonts/Poppins/Poppins-Medium.ttf)`,
            fontWeight: 500,
        },
        {
            fontFamily: 'Poppins',
            src: `url(/assets/fonts/Poppins/Poppins-SemiBold.ttf)`,
            fontWeight: 600,
        },
        {
            fontFamily: 'Poppins',
            src: `url(/assets/fonts/Poppins/Poppins-Bold.ttf)`,
            fontWeight: 700,
        },
    ],
})
