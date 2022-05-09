import { User, UserData } from '@/entities'
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

  test('should add user with complete data to mailing list', async () => {
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
    const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as User
    const user = await repo.findUserByEmail(email)
    expect(user.name).toBe(name)
    expect(response.name.value).toBe(name)
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
  })
})
