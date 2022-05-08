import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

export class MongodbUserRepository implements UserRepository {
  async add (user: UserData): Promise<void> {
    const userCollection = MongoHelper.getCollection('users')
    const exists = await this.exists(user)

    if (!exists) {
      const userClone: UserData = {
        name: user.name,
        email: user.email
      }
      await userCollection.insertOne(userClone)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userCollection = MongoHelper.getCollection('users')
    const response = await userCollection.findOne<UserData>({ email })
    return response
  }

  async findAllUsers (): Promise<UserData[]> {
    return await MongoHelper.getCollection('users').find<UserData>({}).toArray()
  }

  async exists (user: UserData): Promise<boolean> {
    return await this.findUserByEmail(user.email) != null
  }
}
