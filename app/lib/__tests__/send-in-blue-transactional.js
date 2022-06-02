// https://github.com/EnCiv/undebate-ssp/issues/72
import { expect, test, beforeAll, afterAll, jest, describe } from '@jest/globals'
import SibSMTPApi, { SibGetTemplateId, SibDeleteSmtpTemplate, SibSendTransacEmail } from '../send-in-blue-transactional'

// dummy out logger for tests
//global.logger = { error: jest.fn(e => e) }

const maybe = process.env.SENDINBLUE_API_KEY && process.env.SENDINBLUE_DEFAULT_FROM_EMAIL ? describe : describe.skip

maybe('Test the Send In Blue Transactional APIs', () => {
    test('Template does not exist', async () => {
        const id = await SibGetTemplateId('invalid-template-name')
        expect(id).toBeFalsy()
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
    test('can send a test email', async () => {
        const result = await SibSendTransacEmail({
            to: [{ email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL, name: 'TEST EMAIL' }],
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
