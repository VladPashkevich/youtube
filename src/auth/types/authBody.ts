import { IsString, Length } from 'class-validator';

export class AuthBody {
  @IsString()
  @Length(3, 15)
  login: string;

  password: string;
}
