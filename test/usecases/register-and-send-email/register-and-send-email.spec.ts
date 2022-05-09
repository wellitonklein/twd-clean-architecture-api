import { UserData } from '@/entities'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-email'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

describe('Register and send email to user', () => {
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

  class MailServiceMock implements EmailService {
    public timesSendWasCalled = 0

    async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
      this.timesSendWasCalled++
      return right(options)
    }
  }

  test('should register user and send him/her and email with valid data', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmail({ options: mailOptions, service: mailServiceMock })
    const registerAndSendEmailUseCase = new RegisterAndSendEmail({
      registerUserOnMailingList: registerUseCase,
      sendEmail: sendEmailUseCase
    })
    const name = 'any_name'
    const email = 'any@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
    const user = await repo.findUserByEmail(email)
    expect(user.name).toBe(name)
    expect(response.name).toBe(name)
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
  })

  test('should not register user and send him/her and email with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmail({ options: mailOptions, service: mailServiceMock })
    const registerAndSendEmailUseCase = new RegisterAndSendEmail({
      registerUserOnMailingList: registerUseCase,
      sendEmail: sendEmailUseCase
    })
    const name = 'any_name'
    const invalidEmail = 'invalid_email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name, email: invalidEmail })).value as Error
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not register user and send him/her and email with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmail({ options: mailOptions, service: mailServiceMock })
    const registerAndSendEmailUseCase = new RegisterAndSendEmail({
      registerUserOnMailingList: registerUseCase,
      sendEmail: sendEmailUseCase
    })
    const nameInvalid = 'a'
    const email = 'any@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name: nameInvalid, email })).value as Error
    expect(response.name).toEqual('InvalidNameError')
  })
})
