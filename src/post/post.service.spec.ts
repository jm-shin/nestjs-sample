import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { FilterQuery, Model } from 'mongoose';
import { Post } from '../database/post.model';
import { POST_MODEL } from '../database/database.constants';
import { lastValueFrom } from 'rxjs';

describe('PostService', () => {
  let service: PostService;
  let model: Model<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: POST_MODEL,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            deleteMany: jest.fn(),
            deleteOne: jest.fn(),
            updateOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.get<PostService>(PostService);
    model = module.get<Model<Post>>(POST_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all posts', async () => {
    const posts = [
      {
        _id: '62b97040c8d9ffc6aae22f44',
        title: '안녕하세요',
        content: '컨텐츠1',
      },
      {
        _id: '62b97040c8d9ffc6aae22f45',
        title: '반갑습니다',
        content: '컨텐츠2',
      },
      {
        _id: '62b97040c8d9ffc6aae22f46',
        title: '행복하세요',
        content: '컨텐츠3',
      },
    ];
    jest.spyOn(model, 'find').mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(posts) as any,
        }),
      }),
    } as any);

    const data = await lastValueFrom(service.findAll());
    expect(data.length).toBe(3);
    expect(model.find).toHaveBeenCalled();

    jest
      .spyOn(model, 'find')
      .mockImplementation(
        (
          conditions: FilterQuery<Post>,
          callback?: (err: any, res: Post[]) => void,
        ) => {
          return {
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce([posts[0]]) as any,
              }),
            }),
          } as any;
        },
      );
    const result = await lastValueFrom(service.findAll('안녕하세요', 0, 10));
    expect(result.length).toBe(1);
    expect(model.find).lastCalledWith({
      title: { $regex: '.*' + '안녕하세요' + '.*' },
    });
  });
});
