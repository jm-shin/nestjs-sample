import { RoleType } from '../shared/enum/role-type.enum';
import { Model } from 'mongoose';

interface User extends Document {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly roles?: RoleType[];
}

type UserModel = Model<User>;

export {
  User,
  UserModel
};
