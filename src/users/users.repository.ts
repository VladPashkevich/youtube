import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDB, UsersDocument } from '../infrastructure/db';
import {
  CreateUsersDto,
  UserAccountDBType,
  UserAccountOnType,
  UserForMe,
  UserResponseType,
  UsersTypeFromDB,
} from './Types/usersTypes';

interface UsersData {
  users: UsersTypeFromDB[];
  totalCount: number;
}

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UsersDB.name)
    private UsersModel: Model<UsersDocument>,
  ) {}
  async getAllUsers(pageNumber: number, pageSize: number): Promise<UsersData> {
    const usersTypeFromDb = await this.UsersModel.find()
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await this.UsersModel.countDocuments();
    const users = usersTypeFromDb.map((u) => ({
      id: u._id.toString(),
      login: u.accountData.login,
    }));

    return {
      users: users,
      totalCount: totalCount,
    };
  }

  async createNewUser(
    newUser: CreateUsersDto,
  ): Promise<UserAccountDBType | null> {
    /* const { id, ...rest } = newUser;
      const user = await this.UsersModel.insertMany({
        ...rest,
        _id: id,
      }); */
    const user = new this.UsersModel(newUser);
    await user.save();
    if (user) return user;
    return null;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.UsersModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async getUserById(id: string): Promise<UsersTypeFromDB | null> {
    const user = await this.UsersModel.findOne({ _id: id });
    if (user) {
      return {
        id: user._id.toString(),
        login: user.accountData.login,
      };
    }
    return null;
  }

  async getUserByIdToken(id: string): Promise<UserForMe | null> {
    const user = await this.UsersModel.findOne({ _id: id });
    if (user) {
      return {
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user._id.toString(),
      };
    }
    return null;
  }

  async getUserByIdForAuth(id: string): Promise<UserAccountDBType | null> {
    const user = await this.UsersModel.findOne({ _id: id });
    if (user) {
      return user;
    }
    return null;
  }

  async findByLogin(login: string): Promise<UserAccountOnType | null> {
    const user = this.UsersModel.findOne({ 'accountData.login': login });
    if (user) {
      return user;
    }
    return null;
  }

  async findByConfirmationCode(emailConfirmationCode: string) {
    const user = await this.UsersModel.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    });
    return user;
  }

  async updateConfirmation(id: string) {
    const result = await this.UsersModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async findByEmail(email: string): Promise<UserAccountDBType | null> {
    const user = await this.UsersModel.findOne({ 'accountData.email': email });
    if (user) {
      return user;
    }
    return null;
  }

  async updateConfirmationCode(id: string, emailConfirmationCode: string) {
    const result = await this.UsersModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.confirmationCode': emailConfirmationCode } },
    );
    return result.modifiedCount === 1;
  }
}
