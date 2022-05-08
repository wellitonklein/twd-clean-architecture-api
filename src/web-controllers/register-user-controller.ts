import { UserData } from '@/entities'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created, serverError } from '@/web-controllers/util'
import { MissingParamError } from '@/web-controllers/errors'
import { UseCase } from '@/usecases/ports'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either } from '@/shared'

export class RegisterUserController {
  private readonly usecase: UseCase<UserData, Either<InvalidNameError | InvalidEmailError, UserData>>

  constructor (usecase: UseCase<UserData, Either<InvalidNameError | InvalidEmailError, UserData>>) {
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

      const userData = request.body as UserData
      const response = await this.usecase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return created(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
