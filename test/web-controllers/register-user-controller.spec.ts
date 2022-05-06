import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterUserController } from '@/web-controllers'
import { HttpRequest } from '@/web-controllers/ports'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Register user web controller', () => {
  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any name',
        email: 'any@mail.com'
      }
    }
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase = new RegisterUserOnMailingList(repo)
    const controller = new RegisterUserController(usecase)
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })
})
