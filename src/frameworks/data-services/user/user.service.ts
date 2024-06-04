import { Injectable } from "@nestjs/common";
import { User } from "../../../core/entities";
import { IUserServices } from "../../../core/abstracts/user-services.service";
import { PrismaService } from "../prisma/prisma.service";
import { createUserDto } from "src/core/dtos";
import { UserMapper } from "src/core/mappers";
import * as bcrypt from "bcrypt";
import { AuthenticationService } from "src/use-cases/user/authentication.service";
@Injectable()
export class userService implements IUserServices {
  private prismaService: PrismaService;

  constructor(
    prismaService: PrismaService,

    private authService: AuthenticationService
  ) {
    this.prismaService = prismaService;
    this.authService = authService;
  }
  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createUserData(createUserDto: createUserDto): Promise<User> {
    try {
      const hashedPassword = await this.authService.hashPassword(
        createUserDto.password
      );
      const userEntity = UserMapper.toCreateUserDto(createUserDto);
      const user = await this.prismaService.user.create({
        data: {
          ...userEntity,
          password_hash: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
