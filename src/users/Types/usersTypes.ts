import { Length } from 'class-validator';
import mongoose from 'mongoose';

export type UserRequestType = {
  _id: mongoose.Types.ObjectId;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};

export type UserAccountDBType = {
  _id: mongoose.Types.ObjectId;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};

export type UserResponseType = {
  id: string;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};

/*  export class UserAccountClass {
    constructor(
      public _id: ObjectId,
      public accountData: {
        email: string;
        login: string;
        passwordHash: string;
        passwordSalt: string;
        createdAt: Date;
      },
      public emailConfirmation: {
        isConfirmed: boolean;
        confirmationCode: string;
        expirationDate: Date;
      },
    ) {}
  } */

export type UserForMe = {
  email: string;
  login: string;
  userId: string;
};

export type UserAccountOnType = {
  _id: mongoose.Types.ObjectId;
  accountData: UserAccountType;
  emailConfirmation: EmailConfirmationType;
};

export type EmailConfirmationType = {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: Date;
};

export type UserAccountType = {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};

export type UsersTypeFromDB = {
  id: string;
  login: string;
};

export type UsersDBType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersTypeFromDB[];
};
export class CreateUsersDto {
  accountData: AccountData;
  emailConfirmation: EmailConfirmation;
}

export class AccountData {
  email: string;
  login: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
}

export class EmailConfirmation {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: Date;
}

export class CreateUserDto {
  @Length(3, 15)
  login: string;
  password: string;
  email: string;
}

// type X<T> = {
//   a: T;
// }

// const x: X<string> = {
//   a: '123'
// }
