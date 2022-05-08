import { Either } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

export class SendEmail implements UseCase<EmailOptions, Either<MailServiceError, EmailOptions>> {
  private readonly service: EmailService

  constructor (service: EmailService) {
    this.service = service
  }

  async perform (request: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = `E aí <b>${request.username}</b>, beleza?`
    const customizedHtml = `${greetings} </br></br> ${request.html}`
    const emailInfo: EmailOptions = {
      ...request,
      html: customizedHtml
    }

    return await this.service.send(emailInfo)
  }
}
