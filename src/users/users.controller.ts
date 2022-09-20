import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ValidateMongoId } from '../auth/guards/mongoID.guard';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guards';
import { CreateUserDto } from './Types/usersTypes';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  getAllUsers(
    @Query('pageNUmber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.usersService.getAllUsers(pageNumber, pageSize);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createUser(@Body() userDto: CreateUserDto) {
    const user = await this.usersService.createdNewUser(
      userDto.login,
      userDto.email,
      userDto.password,
    );
    if (user) {
      return {
        id: user._id.toString(),
        login: user.accountData.login,
      };
    }
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':userId')
  @HttpCode(204)
  async deleteUser(@Param('userId', ValidateMongoId) userId: string) {
    const isDeleted = await this.usersService.deleteUserById(userId);
    if (isDeleted) return;
    throw new NotFoundException('User Not Found');
  }
}
