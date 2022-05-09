import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { SendEmail } from '@/usecases/send-email'
import { UseCase } from '@/usecases/ports'
import { User, UserData } from '@/entities'
import { Either, left, right } from '@/shared'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { MailServiceError } from '@/usecases/errors'

interface RegisterAndSendEmailParam {
  registerUserOnMailingList: RegisterUserOnMailingList
  sendEmail: SendEmail
}

export class RegisterAndSendEmail implements UseCase<UserData, Either<MailServiceError | InvalidNameError | InvalidEmailError, User>> {
  private registerUserOnMailingList: RegisterUserOnMailingList
  private sendEmail: SendEmail

  constructor ({ registerUserOnMailingList, sendEmail }: RegisterAndSendEmailParam) {
    this.registerUserOnMailingList = registerUserOnMailingList
    this.sendEmail = sendEmail
  }

  async perform (request: UserData): Promise<Either<MailServiceError | InvalidNameError | InvalidEmailError, User>> {
    const errorOrUser = User.create(request)

    if (errorOrUser.isLeft()) {
      return left(errorOrUser.value)
    }

    const user = errorOrUser.value as User

    await this.registerUserOnMailingList.perform(user)
    const response = await this.sendEmail.perform(user)

    if (response.isLeft()) {
      return left(response.value)
    }

    return right(user)
  }
}
