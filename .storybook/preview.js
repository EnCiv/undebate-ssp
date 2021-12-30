import { ThemeProvider } from 'react-jss'
import '../assets/styles/index.css'
import theme from '../theme'

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [
    Story => (
        <ThemeProvider theme={theme}>
            <div>
                <Story />
            </div>
        </ThemeProvider>
    ),
]
