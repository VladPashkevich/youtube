import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { EmailManager } from '../email/email.manager';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersService: UsersService,
    protected emailManager: EmailManager,
  ) {}

  async generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async createUser(login: string, email: string, password: string) {
    const newUser = await this.usersService.createdNewUser(
      login,
      email,
      password,
    );
    if (!newUser) return null;
    await this.emailManager.sendEmailConfirmationMessage(newUser);
    return newUser;
  }

  async confirmCode(code: string): Promise<boolean> {
    const user = await this.usersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    const result = await this.usersRepository.updateConfirmation(
      user._id.toString(),
    );
    return result;
  }

  async confirmEmailResending(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    const code = uuidv4();
    const { ...rest } = user;
    const newUser = {
      ...rest,
      emailConfirmation: {
        isConfirmed: true,
        confirmationCode: code,
        expirationDate: add(new Date(), {
          hours: 24,
        }),
      },
    };
    await this.usersRepository.updateConfirmationCode(
      user._id.toString(),
      code,
    );
    await this.emailManager.sendEmailConfirmationMessage(newUser);
    return true;
  }
}
