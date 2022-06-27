import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from '../database/post.model';
import { from, Observable } from 'rxjs';

@Injectable()
export class PostService {
  constructor(@Inject('POST_MODEL') private postModel: Model<Post>) {
  }

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
}
