global.logger = { ...console }
if (process.env.JEST_LOGGER_ERRORS_TO_CONSOLE)
    // see the error messages during jest tests
    global.logger.error = jest.fn((...args) => (console.error(args), args))
else global.logger.error = jest.fn((...args) => args)
global.logger.warn = jest.fn((...args) => args)

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days))
    return this
}

// thanks to https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
export const emailPattern =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

import { expect } from '@jest/globals'

expect.toBeObjectId = () => expect.stringMatching(/^[0-9a-fA-F]{24}$/)
expect.toBeEmail = () => expect.stringMatching(emailPattern)
expect.toBeIsoDate = () =>
    expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
