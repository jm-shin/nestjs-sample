import { Connection } from 'mongoose';
import {
  COMMENT_MODEL,
  DATABASE_CONNECTION,
  POST_MODEL,
  USER_MODEL,
} from './database.constants';
import { Post, createPostModel } from './post.model';

export const databaseModelsProviders = [
  {
    provide: POST_MODEL,
    useFactory: (connection: Connection) => createPostModel(connection),
    inject: [DATABASE_CONNECTION],
  },
];
