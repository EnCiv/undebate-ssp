# Web Components

Here is the flow. When a user visits the server with a url, `getIota()` in [get-iota.js](./app/routes/get-iota) will look up the path in the database. If it finds a match, it will look for a webComponent property and then look for a matching component in the [web-components](./app/web-components) directory and render that on the server through [app/server/routes/serverReactRender](./app/server/routes/server-react-render.jsx). All the properties of this webComponent will be passed as props to the corresponding
React component. Then the page will be sent to the browser, and then rehydrated there, meaning the webComponent will run again on the browser, starting at [app/client/main-app.js](./app/client/main-app.js) and react will connect all the DOM elements.

### WebComponent example [./app/web-components](./app/components/web-components)

here is a simple one, ./app/web-components/undebate-iframes.js:

```
'use strict'

import React from 'react'
import injectSheet from 'react-jss'

class UndebateIframes extends React.Component {
  render() {
    const { classes } = this.props
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080

    return (
      <div>
        <div>
          <span className={classes['title']}>These are the Undebates</span>
        </div>
        <iframe
          className={classes.frame}
          height={height * 0.9}
          width={width}
          name="race1"
          src="https://cc.enciv.org/san-francisco-district-attorney"
        />
        <iframe
          className={classes.frame}
          height={height * 0.9}
          width={width}
          name="race2"
          src="https://cc.enciv.org/country:us/state:wi/office:city-of-onalaska-mayor/2020-4-7"
        />
      </div>
    )
  }
}

const styles = {
  title: {
    color: 'black',
    fontSize: '2rem',
    textAlign: 'center',
  },
  frame: { marginTop: '1em', marginBottom: '1em', width: '100vw' },
}

export default injectSheet(styles)(UndebateIframes)
```
