import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: Prisma.UserCreateInput): Promise<{ access_token: string }> {
    const { email, password, firstName, lastName } = user;
    const userExists = await this.usersService.getUser(email);
    if (userExists) {
      throw new UnauthorizedException('User already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.usersService.createUser(
      email,
      hashedPassword,
      firstName,
      lastName,
    );
    const payload = { sub: createdUser.id, name: createdUser.firstName };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.getUser(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const payload = { sub: user.id, name: user.firstName };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
