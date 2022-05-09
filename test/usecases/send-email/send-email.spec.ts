import { Either, left, Left, Right, right } from '@/shared'
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
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response).toBeInstanceOf(Right)
  })

  test('should not try to email with invalid email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail({ options: mailOptions, service: mailServiceStub })
    const invalidEmail = 'invalid_email.com'
    const response = await useCase.perform({ name: toName, email: invalidEmail })
    expect(response).toBeInstanceOf(Left)
  })

  test('should return error when email service fails', async () => {
    const mailServiceerrorStub = new MailServiceErrorStub()
    const useCase = new SendEmail({ options: mailOptions, service: mailServiceerrorStub })
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
