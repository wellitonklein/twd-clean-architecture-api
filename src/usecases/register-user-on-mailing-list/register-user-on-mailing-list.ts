import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { User, UserData } from '@/entities'
import { Either, left, right } from '@/shared'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { UseCase } from '@/usecases/ports'

export class RegisterUserOnMailingList implements UseCase<UserData, Either<InvalidNameError | InvalidEmailError, UserData>> {
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
