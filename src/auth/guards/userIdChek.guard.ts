import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { Observable } from 'rxjs';
import { Request } from 'express';
import { JWTService } from '../../aplication/jwt.service';
import { UsersService } from '../../users/users.service';
import { RequestWithUser } from 'index';
@Injectable()
export class UserIdChek implements CanActivate {
  constructor(
    protected jwtService: JWTService,
    protected usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestWithUser & Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      req.user = null;
      return true;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.getUserIdByToken(token);
    if (userId) {
      req.user = await this.usersService.getUserByIdForAuth(userId.toString());
      return true;
    }
    return true;
  }
}
