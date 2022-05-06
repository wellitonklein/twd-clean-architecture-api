import { UserData } from '../../../src/entities/user-data'
import { UserRepository } from '../../../src/usecases/register-user-on-mailing-list/ports/user-repository'
import { RegisterUserOnMailingList } from '../../../src/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from './repository/in-memory-user-repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const response = await usecase.perform({ name, email })
    const user = await repo.findUserByEmail(email)
    expect(user.name).toBe(name)
    expect(response.value.name).toBe(name)
  })

  test('should not add user with invalid email to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const invalidEmail = 'invalid_email.com'
    const response = (await usecase.perform({ name, email: invalidEmail })).value as Error
    const user = await repo.findUserByEmail(invalidEmail)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add user with invalid name to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase = new RegisterUserOnMailingList(repo)
    const invalidName = ''
    const email = 'any@mail.com'
    const response = (await usecase.perform({ name: invalidName, email })).value as Error
    const user = await repo.findUserByEmail(email)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })
})
