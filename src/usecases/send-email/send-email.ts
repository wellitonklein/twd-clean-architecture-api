import { User } from '@/entities'
import { Either } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

export interface SendEmailParam {
  options: EmailOptions
  service: EmailService
}

export class SendEmail implements UseCase<User, Either<MailServiceError, EmailOptions>> {
  private readonly options: EmailOptions
  private readonly service: EmailService

  constructor ({ options, service }: SendEmailParam) {
    this.options = options
    this.service = service
  }

  async perform (request: User): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = `E aí <b>${request.name.value}</b>, beleza?`
    const customizedHtml = `${greetings} </br></br> ${this.options.html}`
    const emailInfo: EmailOptions = {
      ...this.options,
      to: `${request.name.value} <${request.email.value}>`,
      html: customizedHtml
    }

    return await this.service.send(emailInfo)
  }
}
