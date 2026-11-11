import { IsEmail, MaxLength, MinLength } from 'class-validator';

const MIN_PASSWORD_LENGTH = 8;
// bcrypt only reads the first 72 bytes of a password
const MAX_PASSWORD_LENGTH = 72;

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;
}
