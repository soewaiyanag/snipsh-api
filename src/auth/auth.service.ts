import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register({ email, password }: RegisterDto) {
    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return this.users.create(email, passwordHash);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.users.findByEmail(email);
    const passwordMatches =
      user && (await bcrypt.compare(password, user.passwordHash));
    // Same message for unknown email and wrong password, so attackers can't tell which emails exist
    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id });
    return { accessToken };
  }
}
