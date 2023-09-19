import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';


dotenv.config();

const sendingEmail = "freedomwhoami9623@gmail.com";

// export const createVerificationEmail = (
//   receiverEmail: string,
//   verificationTokenValue: string
// ): sgMail.MailDataRequired => {
//   const email = {
//     to: receiverEmail,
//     from: `${sendingEmail}`,
//     subject: "Email Verification",
//     text: "Some uselss text",
//     html: `<p>Please verify your account by clicking the link: 
//   <a href="http://${host}/account/confirm/${verificationTokenValue}">http://${host}/account/confirm/${verificationTokenValue}</a> </p>`,
//   };

//   return email;
// };

export function sendMail(
  name?: string,
  email?: string,
  subject?: string,
  message?: string
) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log('Sending welcome email', process.env.SENDGRID_API_KEY)
  const msg = {
    to: `${email}`, // Change to your recipient
    from: `${sendingEmail}`, // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    templateId: 'd-9cde6d165c9e425dbc9c5d84497ae470',
    dynamicTemplateData: {
      name: name,
      email: `: ${email}`,
      subject: subject,
      message: message
    },
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Welcom Signup email sent')
    })
    .catch(err => {
      console.log(err)
    })
}
