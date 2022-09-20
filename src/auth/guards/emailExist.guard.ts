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
    const email = req.body.email;
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      return true;
    } else {
      throw new HttpException(
        {
          errorsMessages: [{ message: 'Email already exist', field: 'email' }],
        },
        400,
      );
    }
  }
}
