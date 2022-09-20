import { Injectable } from '@nestjs/common';
import { UserAccountDBType } from 'src/users/Types/usersTypes';
import { EmailAdapter } from './email.adapter';

@Injectable()
export class EmailManager {
  constructor(protected emailAdapter: EmailAdapter) {
    this.emailAdapter = emailAdapter;
  }

  async sendEmailConfirmationMessage(user: UserAccountDBType) {
    await this.emailAdapter.sendEmail(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
      'resending-code',
    );
  }
}
