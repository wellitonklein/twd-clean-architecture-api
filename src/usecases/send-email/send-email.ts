import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

export interface SendEmailParam {
  options: EmailOptions
  service: EmailService
}

export class SendEmail implements UseCase<UserData, Either<MailServiceError | InvalidNameError | InvalidEmailError, EmailOptions>> {
  private readonly options: EmailOptions
  private readonly service: EmailService

  constructor ({ options, service }: SendEmailParam) {
    this.options = options
    this.service = service
  }

  async perform (request: UserData): Promise<Either<MailServiceError | InvalidNameError | InvalidEmailError, EmailOptions>> {
    const errorOrUser = User.create(request)

    if (errorOrUser.isLeft()) {
      return left(errorOrUser.value)
    }

    const user = errorOrUser.value as User

    const greetings = `E aí <b>${user.name.value}</b>, beleza?`
    const customizedHtml = `${greetings} </br></br> ${this.options.html}`
    const emailInfo: EmailOptions = {
      ...this.options,
      to: `${user.name.value} <${user.email.value}>`,
      html: customizedHtml
    }

    return await this.service.send(emailInfo)
  }
}
