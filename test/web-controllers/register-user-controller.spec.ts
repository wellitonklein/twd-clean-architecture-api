import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { RegisterUserController } from '@/web-controllers'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest } from '@/web-controllers/ports'

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const usecase = new RegisterUserOnMailingList(repo)
  const controller = new RegisterUserController(usecase)

  class ErrorThrowingUseCaseStub implements UseCase<UserData, Either<InvalidNameError | InvalidEmailError, UserData>> {
    async perform (request: any): Promise<any> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub = new ErrorThrowingUseCaseStub()

  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any name',
        email: 'any@mail.com'
      }
    }
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })

  test('should return status code 400 when request contains invalid name', async () => {
    const request: HttpRequest = {
      body: {
        name: 'a',
        email: 'any@mail.com'
      }
    }
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid email', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any name',
        email: 'anymail.com'
      }
    }
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const request: HttpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any name'
      }
    }
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing user name and email', async () => {
    const request: HttpRequest = {
      body: {}
    }
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name and email.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'any name',
        email: 'any@mail.com'
      }
    }
    const controller = new RegisterUserController(errorThrowingUseCaseStub)
    const response = await controller.handle(request)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
