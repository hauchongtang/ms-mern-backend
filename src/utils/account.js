const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid')


const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY
  })
)

const sendForgotPassword = (user, userK) => {

  const url = `http://localhost:3000/api/forgot-password/${userK.key}`

  transport.sendMail({
    from: process.env.ADMIN_MAIL,
    to: `<${user.email}>`,
    subject: 'Forgot Password Mail',
    html: `Forgot Password Mail Test <a href=${url}> ${url} </a>`
  })
}


const sendActivatedEmail = (user) => {
  
  transport.sendMail({
    from: process.env.ADMIN_MAIL,
    to: `<${user.email}>`,
    subject: 'Your Email has been Activated',
    html: `Your email has been activated. Please visit our homepage.`
  
})
}


const sendConfirmationEmail = (user) => {
  const url = `http://localhost:3000/api/verify/${user.activationKey}`

  transport.sendMail({
    from: process.env.ADMIN_MAIL,
    to: `<${user.email}>`,
    subject: 'Confirmation Email',
    html: `Confirmation Email Testing :) <a href=${url}> ${url}</a>`
  })
}

module.exports = {
  sendConfirmationEmail,
  sendActivatedEmail,
  sendForgotPassword
}
