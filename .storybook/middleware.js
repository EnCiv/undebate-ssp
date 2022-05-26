// Storybook is run on an express server, and this middleware fill lets routes be added
// To test the AuthForm component we need to handle the post request and give a response

const expressMiddleWare = require('civil-client/.storybook/middleware')

module.exports = expressMiddleWare
