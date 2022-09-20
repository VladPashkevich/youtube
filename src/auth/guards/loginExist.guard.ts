import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersRepository } from 'src/users/users.repository';
@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(protected usersRepository: UsersRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const login = req.body.login;
    const user = await this.usersRepository.findByEmail(login);
    if (user) {
      return true;
    } else {
      throw new HttpException(
        {
          errorsMessages: [{ message: 'Login already exist', field: 'login' }],
        },
        400,
      );
    }
  }
}
