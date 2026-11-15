import { IPost } from "@domain/model/post.interface";
import { Posts } from "@infrastructure/orm/entities/post.entity";


export interface IPostRepository {
    findAll: (page: number, limit: number, consumerId: number) => Promise<Partial<Posts[]>>
    findById: (id: number) => Promise<Partial<IPost> | null>
}