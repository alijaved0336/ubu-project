import { type IUser } from '@domain/model/user.interface'
import { DeleteResult, UpdateResult } from 'typeorm'

export interface IUserRepository {
  findById: (id: number) => Promise<Partial<IUser> | null>
  // create: (user: Partial<IUser>) =>  Promise<Partial<IUser>>
  findByEmail: (email: string) => Promise<Partial<IUser | null>>
}
