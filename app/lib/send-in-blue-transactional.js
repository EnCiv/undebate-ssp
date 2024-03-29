// https://github.com/EnCiv/undebate-ssp/wiki/Send-In-Blue-Transactional
const SibApiV3Sdk = require('sib-api-v3-sdk')
const path = require('path')
const fs = require('fs') // require so it runs as is without having to bable it
const packageJSON = require('../../package.json')

var SibSMTPApi
export default SibSMTPApi

// parse through HTML text to get the {{params}}
const uniqueParams = content =>
    (content.match(/{{\s*([\w.]+)\s*}}/g) || []) // get the {{ params }} [] in case there's none
        .map(str => str.replace('{{', '').replace('}}', ''))
        .map(s => s.trim())
        .sort((a, b) => a.localeCompare(b))
        .filter((str, pos, ary) => !pos || str != ary[pos - 1]) // filter out duplicates

async function SibCreateTemplate(name, templateName, htmlContent) {
    const subject = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/)[1] || templateName
    try {
        let smtpTemplate = new SibApiV3Sdk.CreateSmtpTemplate()
        smtpTemplate.templateName = name
        smtpTemplate.subject = subject
        smtpTemplate.isActive = true
        smtpTemplate.htmlContent = htmlContent
        smtpTemplate.sender = { name: '[DEFAULT_FROM_NAME]', email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL }
        smtpTemplate.replyTo = '[DEFAULT_REPLY_TO]'
        const data = await SibSMTPApi.createSmtpTemplate(smtpTemplate)
        return data?.id
    } catch (error) {
        logger.error(
            'SendInBlueCreateTemplate caught error',
            error?.response?.res?.text,
            error?.message ? error.message : error
        )
    }
}

async function SibGetTemplate(name, htmlContent) {
    const { templates, count } = await SibSMTPApi.getSmtpTemplates()
    // if new account with no templates yet, templates might be undefined
    // templates are send down with the largest template first in the list
    // older templates with the same name may appear though this seems inconsistent but the last one created will appear first becuase in the list
    const template = templates?.find(t => t.name === name)
    if (!template) {
        return undefined
    } else {
        if (template.htmlContent !== htmlContent) {
            let i = 0
            let j = 0
            let error = false
            for (; i < template.htmlContent.length && j < htmlContent.length; i++, j++) {
                if (template.htmlContent[i] !== htmlContent[j]) {
                    // SendInBlue seems to instert some spaces so we need to skip them
                    if (template.htmlContent[i] === ' ') i++
                    // SendInBlue seems to remove carriage returns so ignore them
                    else if (template.htmlContent[i] === '\r') i++
                    else {
                        logger.error(template.htmlContent.charCodeAt(i), '!==', htmlContent.charCodeAt(j), 'at', i)
                        logger.error('on sendinblue:', template.htmlContent.slice(Math.max(i - 10, 0), i + 10))
                        logger.error('local:', htmlContent.slice(Math.max(j - 10, 0), j + 10))
                        return undefined
                    }
                }
            }
            if (error)
                logger.error('sendModeratorInvite SendInBlue template does not match repo, but using', template?.id)
            const localParams = uniqueParams(htmlContent)
            const remoteParams = uniqueParams(template.htmlContent)
            for (const param of remoteParams) {
                if (!localParams.includes(p => p === param)) continue
                logger.error('remote:', param, 'local: not present')
            }
        }
        return template
    }
}

export async function SibGetTemplateId(templateName) {
    try {
        const htmlFile = path.resolve(__dirname, `../../assets/email-templates/${templateName}.html`)
        const htmlContent = fs.readFileSync(htmlFile, 'utf8')
        if (!htmlContent) return undefined
        const name = packageJSON.name + '/' + templateName
        const template = await SibGetTemplate(name, htmlContent)
        if (template) return template.id
        const newId = await SibCreateTemplate(name, templateName, htmlContent)
        return newId
    } catch (error) {
        logger.error('SibGetTemplateId caught error', error?.message ? error.message : error)
        return undefined
    }
}

export function SibSendTransacEmail(props) {
    return new Promise((ok, ko) => {
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
        Object.assign(sendSmtpEmail, props)
        SibSMTPApi.sendTransacEmail(sendSmtpEmail).then(
            data => {
                ok(data)
            },
            error => {
                logger.error('sendTransacEmail got error', error?.message ? error.message : error, 'props:', props)
                ok()
            }
        )
    })
}

export function SibDeleteSmtpTemplate(id) {
    return new Promise((ok, ko) => {
        SibSMTPApi.updateSmtpTemplate(id, { isActive: false }).then(() => {
            SibSMTPApi.deleteSmtpTemplate(id).then(ok, ko)
        }, ko)
    })
}

if (
    ['SENDINBLUE_API_KEY', 'SENDINBLUE_DEFAULT_FROM_EMAIL'].reduce((allExist, name) => {
        if (!process.env[name]) {
            logger.error('env ', name, 'not set. sendModeratorInvite disabled.')
            return false
        } else return allExist
    }, true)
) {
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY
    SibSMTPApi = new SibApiV3Sdk.TransactionalEmailsApi()
}
