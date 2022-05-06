import { InMemoryUserRepository } from '../../../../src/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { UserData } from '../../../../src/entities/user-data'

describe('In memory User repository', () => {
  test('should return null if user is not foud', async () => {
    const users: UserData[] = []
    const email = 'any@mail.com'
    const sut = new InMemoryUserRepository(users)
    const user = await sut.findUserByEmail(email)
    expect(user).toBeNull()
  })

  test('should return user if it is found in the repository', async () => {
    const users: UserData[] = []
    const name = 'any_name'
    const email = 'any@mail.com'
    const sut = new InMemoryUserRepository(users)
    await sut.add({ name, email })
    const user = await sut.findUserByEmail(email)
    expect(user.name).toBe(name)
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [
      { name: 'any_name', email: 'any@mail.com' },
      { name: 'second_name', email: 'second@mail.com' }
    ]
    const sut = new InMemoryUserRepository(users)
    const returnedUsers = await sut.findAllUsers()
    expect(returnedUsers.length).toBe(2)
  })
})
