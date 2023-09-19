"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
function sendMail(name, email, subject, message) {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('Sending welcome email', process.env.SENDGRID_API_KEY);
    const msg = {
        to: `johnwilliam199024@gmail.com`,
        from: `${sendingEmail}`,
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
    };
    mail_1.default
        .send(msg)
        .then(() => {
        console.log('Welcom Signup email sent');
    })
        .catch(err => {
        console.log(err);
    });
}
exports.sendMail = sendMail;
//# sourceMappingURL=service.js.map