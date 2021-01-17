'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import WebComponent from '../web-components'
import Footer from './footer'
import ErrorBoundary from '../../node_modules/civil-server/dist/components/error-boundary'

class App extends React.Component {
  render() {
    if (this.props.iota) {
      var { iota, ...newProps } = this.props
      Object.assign(newProps, this.props.iota)
      return (
        <ErrorBoundary>
          <div style={{ position: 'relative' }}>
            <WebComponent key="web-component" webComponent={this.props.iota.webComponent} {...newProps} />
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
