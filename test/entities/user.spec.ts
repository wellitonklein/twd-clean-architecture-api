import { User } from '../../src/entities'

describe('User domain entity', () => {
  const name = 'any_name'
  const email = 'any@mail.com'

  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'
    const error = User.create({ name, email: invalidEmail }).value as Error
    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual(`Invalid email: ${invalidEmail}.`)
  })

  test('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'w    '
    const error = User.create({ name: invalidName, email }).value as Error
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`)
  })

  test('should not create user with invalid name (too many characters)', () => {
    const invalidName = 'w'.repeat(257)
    const error = User.create({ name: invalidName, email }).value as Error
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual(`Invalid name: ${invalidName}.`)
  })

  test('should create user with valid data', () => {
    const user = User.create({ name, email }).value as User
    expect(user.name.value).toEqual(name)
    expect(user.email.value).toEqual(email)
  })
})
