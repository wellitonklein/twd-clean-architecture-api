import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { created } from '@/web-controllers/util'

export class RegisterUserController {
  private readonly usecase: RegisterUserOnMailingList

  constructor (usecase: RegisterUserOnMailingList) {
    this.usecase = usecase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const userData = request.body as UserData
    const response = await this.usecase.perform(userData)

    if (response.isRight()) {
      return created(response.value)
    }
  }
}
