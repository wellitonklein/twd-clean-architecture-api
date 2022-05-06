import { Either, left, right } from '../shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { Name } from './name'
import { UserData } from './user-data'

export class User {
  public readonly name: Name
  public readonly email: Email

  private constructor (name: Name, email: Email) {
    this.name = name
    this.email = email
  }

  static create (userData: UserData): Either<InvalidNameError | InvalidEmailError, User> {
    const errorOrName = Name.create(userData.name)

    if (errorOrName.isLeft()) {
      return left(new InvalidNameError(userData.name))
    }

    const errorOrEmail = Email.create(userData.email)

    if (errorOrEmail.isLeft()) {
      return left(new InvalidEmailError(userData.email))
    }

    const name = errorOrName.value as Name
    const email = errorOrEmail.value as Email

    return right(new User(name, email))
  }
}
