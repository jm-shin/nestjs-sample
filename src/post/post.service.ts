import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from '../database/post.model';
import { from, Observable } from 'rxjs';
import { CreatePostDto } from './create-post.dto';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from '../auth/interface/authenticated-request.interface';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_MODEL') private postModel: Model<Post>,
    @Inject(REQUEST) private req: AuthenticatedRequest,
  ) {}

  findAll(keyword?: string, skip = 0, limit = 10): Observable<Post[]> {
    if (keyword) {
      return from(
        this.postModel
          .find({ title: { $regex: '.*' + keyword + '.*' } })
          .skip(skip)
          .limit(limit)
          .exec(),
      );
    } else {
      return from(this.postModel.find({}).skip(skip).limit(limit).exec());
    }
  }

  save(data: CreatePostDto): Observable<Post> {
    const createPost: Promise<Post> = this.postModel.create({
      ...data,
      createdBy: { _id: this.req.user.id },
    });
    return from(createPost);
  }
}
