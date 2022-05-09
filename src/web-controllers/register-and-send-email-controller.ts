import { UserData } from '@/entities'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, ok, serverError } from '@/web-controllers/util'
import { MissingParamError } from '@/web-controllers/errors'
import { UseCase } from '@/usecases/ports'
import { Either } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'

export class RegisterAndSendEmailController {
  private readonly usecase: UseCase<UserData, Either<MailServiceError | InvalidNameError | InvalidEmailError, UserData>>

  constructor (usecase: UseCase<UserData, Either<MailServiceError | InvalidNameError | InvalidEmailError, UserData>>) {
    this.usecase = usecase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.name || !request.body.email) {
        let missingParam: string

        if (!request.body.name && !request.body.email) {
          missingParam = 'name and email'
        } else {
          missingParam = !(request.body.name) ? 'name' : ''
          missingParam += !(request.body.email) ? 'email' : ''
        }

        return badRequest(new MissingParamError(missingParam))
      }

      const userData = request.body
      const response = await this.usecase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return ok(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
