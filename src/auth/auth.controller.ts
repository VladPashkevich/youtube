import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JWTService } from '../aplication/jwt.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthBody } from './types/authBody';
import { Request, Response } from 'express';
import { Mistake429guard } from './guards/Mistake429';
import { UserAuthGuard } from './guards/userAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected usersService: UsersService,
    protected jwtService: JWTService,
  ) {}

  @UseGuards(Mistake429guard)
  @Post('login')
  @HttpCode(200)
  async logininzation(
    @Body() body: AuthBody,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.getUserByLogIn(body.login);
    if (!user) {
      throw new UnauthorizedException();
    }

    const areCredentialsCorrect = await this.usersService.checkCredentials(
      user,
      body.login,
      body.password,
    );
    if (areCredentialsCorrect) {
      const token = await this.jwtService.createJWT(user);
      const refreshToken = await this.jwtService.createJWTRefresh(user);
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 20 * 1000 * 1000,
      });
      return { accessToken: token };
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(Mistake429guard /* UserAuthGuard */)
  @Post('refresh-token')
  async createTwoToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();
    const tokenExpire = await this.jwtService.getUserIdByToken(refreshToken);
    if (tokenExpire === null) throw new UnauthorizedException();
    const findToken = await this.jwtService.refreshTokenFind(refreshToken);
    if (findToken === false) throw new UnauthorizedException();
    await this.jwtService.refreshTokenKill(refreshToken);
    const userId = await this.jwtService.getUserIdByToken(refreshToken);
    if (!userId) throw new UnauthorizedException();
    const user = await this.usersService.getUserByIdForAuth(userId.toString());
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.jwtService.createJWT(user);
    const refreshtoken = await this.jwtService.createJWTRefresh(user);

    response.cookie('refreshToken', refreshtoken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000 * 1000,
    });
    return { accessToken: token };
  }

  @UseGuards(Mistake429guard)
  @Post('logout')
  async logoutFromSystem(@Req() request: Request) {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();
    const tokenExpire = await this.jwtService.getUserIdByToken(refreshToken);
    if (tokenExpire === null) throw new UnauthorizedException();
    const result = await this.jwtService.refreshTokenKill(refreshToken);
    if (result === true) {
      return;
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(Mistake429guard)
  @Post('registration')
  async registrationUser(
    @Body('login') login: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    const user = await this.authService.createUser(login, email, password);
    if (user) {
      return 'message send';
    } else {
      throw new BadRequestException();
    }
  }

  @UseGuards(Mistake429guard)
  @Post('registration-confirmation')
  registrationWithCode(@Body('code') code: string) {
    return this.authService.confirmCode(code);
  }

  @UseGuards(Mistake429guard)
  @Post('registration-email-resending')
  resendingEmailWithCode(@Body('email') email: string) {
    return this.authService.confirmEmailResending(email);
  }

  @Get()
  async showUserAfterAuth(@Req() request: Request, @Res() response: Response) {
    const authHeader = request.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException();
    } else {
      const userId = await this.jwtService.getUserIdByToken(accessToken);
      if (!userId) throw new UnauthorizedException();
      const user = await this.usersService.getUserByIdToken(userId.toString());
      if (user) {
        return user;
      }
    }
  }
}
