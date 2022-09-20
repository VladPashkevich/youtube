import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import mongoose from 'mongoose';
import { UsersRepository } from './users.repository';
import {
  CreateUsersDto,
  UserAccountDBType,
  UserAccountOnType,
  UserForMe,
  UserResponseType,
  UsersDBType,
  UsersTypeFromDB,
} from './Types/usersTypes';
import { EmailAdapter } from '../email/email.adapter';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailAdapter: EmailAdapter,
  ) {}

  async getAllUsers(
    pageNumber: number,
    pageSize: number,
  ): Promise<UsersDBType> {
    const { users, totalCount } = await this.usersRepository.getAllUsers(
      pageNumber,
      pageSize,
    );
    const result: UsersDBType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users,
    };
    return result;
  }

  async createdNewUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserAccountDBType | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser: CreateUsersDto = {
      accountData: {
        login: login,
        email: email,
        passwordHash,
        passwordSalt,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 24,
        }),
        isConfirmed: false,
      },
    };
    const createdUser = await this.usersRepository.createNewUser(newUser);
    if (createdUser) {
      return createdUser;
    } else {
      return null;
    }
  }

  async deleteUserById(id: string): Promise<boolean> {
    return this.usersRepository.deleteUserById(id);
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async getUserById(id: string): Promise<UsersTypeFromDB | null> {
    return this.usersRepository.getUserById(id);
  }

  async getUserByIdToken(id: string): Promise<UserForMe | null> {
    return this.usersRepository.getUserByIdToken(id);
  }

  async getUserByIdForAuth(_id: string): Promise<UserAccountDBType | null> {
    return this.usersRepository.getUserByIdForAuth(_id);
  }

  async checkCredentials(
    user: UserAccountOnType,
    login: string,
    password: string,
  ) {
    const passwordHash = await this._generateHash(
      password,
      user.accountData.passwordSalt,
    );
    if (user.accountData.passwordHash !== passwordHash) {
      return false;
    }
    return true;
  }

  async getUserByLogIn(login: string): Promise<UserAccountOnType | null> {
    return this.usersRepository.findByLogin(login);
  }

  async findUserByEmail(email: string): Promise<UserAccountOnType | null> {
    return this.usersRepository.findByEmail(email);
  }

  async updateConfirmationCode(
    id: string,
    emailConfirmationCode: string,
  ): Promise<boolean> {
    return this.usersRepository.updateConfirmationCode(
      id,
      emailConfirmationCode,
    );
  }
}
