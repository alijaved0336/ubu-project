import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    DeleteDateColumn,
  } from 'typeorm';
import { Consumers } from './consumer.entity';
import { Posts } from './post.entity';

  @Entity({ name: 'post_favourites' })
  export class PostFavourites {
    @PrimaryGeneratedColumn()
    id: number;  

    @ManyToOne(()=>Consumers, (consumers)=>consumers.post_favourites, {nullable: true})
    @JoinColumn({
      name: 'consumer_id',
      foreignKeyConstraintName: 'fk_postfavorite_consumer',
    })
    consumer: Consumers

    @ManyToOne(()=>Posts, (posts)=>posts.post_favourites, {nullable: true})
    @JoinColumn({
      name: 'post_id',
      foreignKeyConstraintName: 'fk_postfavorite_post',
    })
    posts: Posts

    @CreateDateColumn({ type: 'timestamp', name:'created_at' })
    created_at: Date
  
    @UpdateDateColumn({ type: 'timestamp', name:'updated_at' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt?: Date;
  
  }
  