import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async getUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<Prisma.UserCreateInput> {
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
      },
    });
    return user;
  }
}
