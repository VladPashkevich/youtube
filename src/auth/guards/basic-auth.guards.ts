import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
@Injectable()
export class BasicAuthGuard implements CanActivate {
  // constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers?.authorization;
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    const encode = `Basic ${base64}`;
    if (authHeader === encode) {
      return true;
    } else {
      // check Basic auth for login/pass pair: superadmin/12345
      throw new UnauthorizedException();
    }
  }
}
