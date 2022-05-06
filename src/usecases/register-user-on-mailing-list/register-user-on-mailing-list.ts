import { InvalidEmailError, InvalidNameError } from '../../entities/errors'
import { User, UserData } from '../../entities'
import { Either, left, right } from '../../shared'
import { UserRepository } from './ports'

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
