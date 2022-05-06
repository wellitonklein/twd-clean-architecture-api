import { InvalidEmailError } from '../../src/entities/errors/invalid-email-error'
import { InvalidNameError } from '../../src/entities/errors/invalid-name-error'
import { User } from '../../src/entities/user'
import { left } from '../../src/shared/either'

describe('User domain entity', () => {
  const name = 'any_name'
  const email = 'any@mail.com'

  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'
    const error = User.create({ name, email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError()))
  })

  test('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'w    '
    const error = User.create({ name: invalidName, email })
    expect(error).toEqual(left(new InvalidNameError()))
  })

  test('should not create user with invalid name (too many characters)', () => {
    const invalidName = 'w'.repeat(257)
    const error = User.create({ name: invalidName, email })
    expect(error).toEqual(left(new InvalidNameError()))
  })
})
