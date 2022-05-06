import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created } from '@/web-controllers/util'
import { MissingParamError } from '@/web-controllers/errors'

export class RegisterUserController {
  private readonly usecase: RegisterUserOnMailingList

  constructor (usecase: RegisterUserOnMailingList) {
    this.usecase = usecase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
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

    if (response.isRight()) {
      return created(response.value)
    }
  }
}
