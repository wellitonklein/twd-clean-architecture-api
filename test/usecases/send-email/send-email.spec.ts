import { User } from '@/entities'
import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { SendEmail } from '@/usecases/send-email'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'Test'
const fromEmail = 'from_email@mail.com'
const toName = 'any name'
const toEmail = 'to_email@mail.com'
const subject = 'Test e-mail'
const emailBody = 'Hello world attachment test'
const emailBodyHtml = '<b>Hello world attachment test</b>'
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: `${fromName} ${fromEmail}`,
  to: `${toName} <${toEmail}>`,
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachment
}

class MailServiceStub implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(options)
  }
}

class MailServiceErrorStub implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail({ options: mailOptions, service: mailServiceStub })
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = (await useCase.perform(user)).value as EmailOptions
    expect(response.to).toEqual(`${toName} <${toEmail}>`)
  })

  test('should return error when email service fails', async () => {
    const mailServiceerrorStub = new MailServiceErrorStub()
    const useCase = new SendEmail({ options: mailOptions, service: mailServiceerrorStub })
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = await useCase.perform(user)
    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
