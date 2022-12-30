const nodemailer = require("nodemailer")
const Token = require("../models/token.model")
const crypto = require("crypto")
const sendGrid = require("@sendgrid/mail")
sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (email, subject, html) => {
    try {
        if (process.env.ENV === "development") {
            const transporter = nodemailer.createTransport({
                host: process.env.MAILTRAP_HOST,
                port: process.env.MAILTRAP_EMAIL_PORT,

                auth: {
                    user: process.env.MAILTRAP_EMAIL_USER,
                    pass: process.env.MAILTRAP_EMAIL_PASSWORD,
                },
            })

            await transporter.sendMail({
                from: process.env.GMAIL_ID || "",
                to: email,
                subject: subject,
                html: html,
            })

            console.log("mail sent")
        }

        if (process.env.ENV === "production") {
            await sendGrid.send({
                to: email,
                from: process.env.GMAIL_ID,
                subject: subject,
                html: html,
            })

            console.log("sendgrid has sent mail")
        }
    } catch (error) {
        console.log(error)
    }
}

const sendVerificationEmail = async (user) => {
    try {
        let token = await Token.findOne({ _id: user._id })

        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save()
        }

        const url = `${process.env.BASE_URL}/auth/${user._id}/verify-email/${token.token}`
        const html = `
        <html>
        <head>
        <meta charset="UTF-8" />
        </head>
        <body>
        <h1>hello, ${user.name} Welcome to MemoryBook</h1>
        <p>
        we are glad that your have joined our plateform,
        <strong>let's make some good memories togeather!</strong> wheater it's a bad or good
        doesn't matter.
        </p>
        <p>please verify your email account by visiting given url</p>
        <p><a href="${url}">Click here</a></p>
        </body>
        </html>
        `
        await sendEmail(user.email, "Email Verification for memorybook", html)
    } catch (error) {
        console.log(error)
    }
}

const sendResetPasswordEmail = async (user) => {
    try {
        let token = await Token.findOne({ userId: user._id })

        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save()
        }

        const url = `${process.env.BASE_URL}/auth/${user._id}/reset-password/${token.token}`
        const html = `
        <html>
        <head>
        <meta charset="UTF-8" />
        </head>
        <body>
        <h1>hello, ${user.name}</h1>
        <p>click on given url to reset your password it will be valid for an hour. if you haven't then just ignore the message</p>
        <p><a href="${url}">Click here</a></p>
        </body>
        </html>
        `
        await sendEmail(user.email, "Reset Password link", html)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail,
}
