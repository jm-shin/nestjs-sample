import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  Scope,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Observable } from 'rxjs';
import { Post as BlogPost } from '../database/post.model';

@Controller({ path: 'posts', scope: Scope.REQUEST })
export class PostController {
  constructor(private postService: PostService) {}

  @Get('')
  getAllPosts(
    @Query('q') keyword?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ): Observable<BlogPost[]> {
    return this.postService.findAll(keyword, skip, limit);
  }
}
