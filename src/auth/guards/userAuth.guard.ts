import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  // HttpStatus,
  // HttpException,
} from '@nestjs/common';
// import { Observable } from 'rxjs';
import { Request } from 'express';
import { JWTService } from '../../aplication/jwt.service';
import { UsersService } from '../../users/users.service';
import { RequestWithUser } from 'index';
@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    protected jwtService: JWTService,
    protected usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestWithUser & Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.getUserIdByToken(token);
    if (userId) {
      req.user = await this.usersService.getUserByIdForAuth(userId.toString());
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
