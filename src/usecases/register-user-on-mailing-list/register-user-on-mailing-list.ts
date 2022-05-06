import { InvalidEmailError } from '../../entities/errors/invalid-email-error'
import { InvalidNameError } from '../../entities/errors/invalid-name-error'
import { User } from '../../entities/user'
import { UserData } from '../../entities/user-data'
import { Either, left, right } from '../../shared/either'
import { UserRepository } from './ports/user-repository'

export class RegisterUserOnMailingList {
  private userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  async perform (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
    const errorOrUser = User.create(request)

    if (errorOrUser.isLeft()) {
      return left(errorOrUser.value)
    }

    if (!(await this.userRepo.exists(request))) {
      await this.userRepo.add(request)
    }

    return right(request)
  }
}
