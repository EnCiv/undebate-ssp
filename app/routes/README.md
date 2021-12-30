# Routes Directory

Each file in the directory represents an extension to the express server object- which can be this.app.use(...) this.app.get(...) or this.app.push(...)

An example is the sign-in route that looks like this:

```
import expressRateLimit from 'express-rate-limit'
import sendUserId from '../util/send-user-id'

async function signIn(req, res, next) {
  try {
    const { password, ..._body } = req.body // don't let the password appear in the logs
  ...
  } catch(error){
    logger.error("signIn caught error",error)
  }
}

function route() {
  const apiLimiter = expressRateLimit({
    windowMs: 60 * 1000,
    max: 2,
    message: 'Too many attempts logging in, please try again after 24 hours.',
  })
  this.app.post('/sign/in', apiLimiter, signIn, this.setUserCookie, sendUserId)
}
export default route
```

The default function of the file will be called with this of the express object as the server starts up.
