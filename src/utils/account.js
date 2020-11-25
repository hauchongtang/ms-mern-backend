// const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid')
const { getMaxListeners } = require('../models/User')

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY
  })
)

const sendConfirmationEmail = (user) => {
  const url = `http://localhost:3000/api/verify/${user.activationKey}`

  transport.sendMail({
    from: process.env.ADMIN_MAIL,
    to: `<${user.email}>`,
    subject: 'Confirmation Email',
    html: `Confirmation Email Testing :) <a href=${url}> ${url}</a>`,
  })
}

module.exports = {
  sendConfirmationEmail,
}
