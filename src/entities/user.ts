import { Either, left, right } from '@/shared'
import { Email, Name, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'

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
      return left(errorOrName.value)
    }

    const errorOrEmail = Email.create(userData.email)

    if (errorOrEmail.isLeft()) {
      return left(errorOrEmail.value)
    }

    const name = errorOrName.value as Name
    const email = errorOrEmail.value as Email

    return right(new User(name, email))
  }
}
