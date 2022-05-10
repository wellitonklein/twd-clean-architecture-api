import * as nodemailer from 'nodemailer'

import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

export class NodeMailerEmailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    try {
      const transporter = nodemailer.createTransport({
        host: options.host,
        port: options.port,
        secure: false,
        auth: {
          user: options.username,
          pass: options.password
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      }, (error, info) => {
        if (error) {
          return console.error(options)
          // return console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
      })

      return right(options)
    } catch (error) {
      return left(new MailServiceError())
    }
  }
}
