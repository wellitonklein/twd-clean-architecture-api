import { EmailOptions } from '@/usecases/send-email/ports'

const attachments = [{
  filename: 'clean-architecture.pdf',
  path: 'https://otaviolemos.github.io/clean-architecture.pdf',
  contentType: 'application/pdf'
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Welliton Klein <welliton.fokushima@gmail.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from,
    to,
    subject: 'Mensagem de teste',
    text: 'Texto da mensage',
    html: '<b>Texto da mensage</b>',
    attachments
  }

  return mailOptions
}
