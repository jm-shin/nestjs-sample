import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { lastValueFrom, of } from 'rxjs';
import { PostService } from './post.service';

describe('PostController', () => {
  describe('useValue: fake object', () => {
    let controller: PostController;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: PostService,
            useValue: {
              findAll: (_keyword?: string, _skip?: number, _limit?: number) =>
                of<any[]>([
                  {
                    _id: 'testid',
                    title: 'test title',
                    content: 'test content',
                  },
                ]),
            },
          },
        ],
        controllers: [PostController],
      }).compile();

      controller = await module.resolve<PostController>(PostController);
    });

    it('should get all posts', async () => {
      const result = await lastValueFrom(controller.getAllPosts());
      expect(result[0]._id).toEqual('testid');
    });
  });
});
