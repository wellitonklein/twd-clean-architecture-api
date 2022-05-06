import { Either, left } from '../shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { UserData } from './user-data'

export class User {
  static create (userData: UserData): Either<InvalidEmailError, User> {
    const errorOrEmail = Email.create(userData.email)

    if (errorOrEmail.isLeft()) {
      return left(new InvalidEmailError())
    }
  }
}
