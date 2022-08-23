// https://github.com/EnCiv/undebate-ssp/wiki/Send-In-Blue-Transactional
import { expect, test, beforeAll, afterAll, jest, describe } from '@jest/globals'

global.logger = { ...console }
if (process.env.JEST_LOGGER_ERRORS_TO_CONSOLE)
    // see the error messages during jest tests
    global.logger.error = jest.fn((...args) => (console.error(args), args))
else global.logger.error = jest.fn((...args) => args)
global.logger.warn = jest.fn((...args) => args)

// has to be require, not import, so it doesn't get hoisted and run before global.logger is set above
const { SibGetTemplateId, SibDeleteSmtpTemplate, SibSendTransacEmail } = require('../send-in-blue-transactional')

const maybe = process.env.SENDINBLUE_API_KEY && process.env.SENDINBLUE_DEFAULT_FROM_EMAIL ? describe : describe.skip
const maybeNot = !(process.env.SENDINBLUE_API_KEY && process.env.SENDINBLUE_DEFAULT_FROM_EMAIL)
    ? describe
    : describe.skip

maybeNot('Is Sendinblue environment setup for testing?', () => {
    test('No, go to https://github.com/EnCiv/undebate-ssp/wiki/Send-In-Blue-Transactional for info on setup', () => {
        expect(global.logger.error.mock.results[0].value).toMatchInlineSnapshot(`
            Array [
              "env ",
              "SENDINBLUE_API_KEY",
              "not set. sendModeratorInvite disabled.",
            ]
        `)
    })
})
maybe('Test the Sendinblue Transactional APIs', () => {
    test('Template does not exist', async () => {
        const id = await SibGetTemplateId('invalid-template-name')
        expect(id).toBeFalsy()
        expect(global.logger.error.mock.results[0].value[0]).toMatch('SibGetTemplateId caught error')
        expect(global.logger.error.mock.results[0].value[1]).toMatch(/^ENOENT: no such file or directory.+/)
    })
    let id
    test('Template exists or can be created', async () => {
        id = await SibGetTemplateId('jest-test')
        expect(id).toBeGreaterThan(0)
    })
    test('Template can be deleted', async () => {
        await expect(SibDeleteSmtpTemplate(id)).resolves.not.toThrowError()
    })
    let newId
    test('Template can be created', async () => {
        newId = await SibGetTemplateId('jest-test')
        expect(newId).toBeGreaterThan(id)
    })
    test('Can send a test email, check your inbox', async () => {
        const result = await SibSendTransacEmail({
            to: [{ email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL, name: 'TEST EMAIL' }],
            sender: { email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL, name: 'EnCiv Test Email' },
            templateId: newId,
            params: {
                name: 'TEST EMAIL',
                email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
                organizationLogo: 'https://www.bringfido.com/assets/images/bfi-logo-new.jpg',
            },
        })
        expect(result.messageId).toBeTruthy()
    })
})
