'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import WebComponents from '../web-components'
import Footer from './footer'
import { ErrorBoundary } from 'civil-client'

class App extends React.Component {
    render() {
        if (this.props.iota) {
            var { iota, ...newProps } = this.props
            Object.assign(newProps, this.props.iota)
            return (
                <ErrorBoundary>
                    <div style={{ position: 'relative' }}>
                        <WebComponents key="web-component" webComponent={this.props.iota.webComponent} {...newProps} />
                        <Footer key="footer" />
                    </div>
                </ErrorBoundary>
            )
        } else
            return (
                <ErrorBoundary>
                    <div style={{ position: 'relative' }}>
                        <div>Nothing Here</div>
                        <Footer />
                    </div>
                </ErrorBoundary>
            )
    }
}

export default hot(module)(App)
