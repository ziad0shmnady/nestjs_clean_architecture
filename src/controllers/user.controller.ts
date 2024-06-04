import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
  HttpException,
  UseGuards,
  Req,
  Patch,
} from "@nestjs/common";
import { UserUseCases } from "src/use-cases/user/user.use-case";
import { InitialRegistrationDto, createUserDto, loginDto } from "src/core/dtos";
import { Roles } from "src/frameworks/guards/roles.decorator";
import { RolesGuard } from "src/frameworks/guards/roles.guard";
import { EntityUsers, Role } from "src/constants";
import { JwtAuthGuard } from "src/frameworks/guards/jwt-auth.guard";
import { GetCurrentUser } from "src/frameworks/decorator/getCurrentUser.decorator";
@Controller("api/user")
export class UserController {
  constructor(private userUseCases: UserUseCases) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: createUserDto) {
    try {
      const newUser = await this.userUseCases.createUser(createUserDto);
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Public)
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@GetCurrentUser() user: { id: string; role: EntityUsers }) {
    try {
      const users = await this.userUseCases.getAllUsers(user);
      return users;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("initial-registration")
  async initialRegistration(
    @Body() createUserDto: InitialRegistrationDto
  ): Promise<{ token: string }> {
    try {
      const token = await this.userUseCases.initialUserRegistration(
        createUserDto
      );
      return { token };
    } catch (error) {
      if (error.message === "User with this email already exists") {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: "User with this email already exists",
          },
          HttpStatus.FORBIDDEN
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Internal server error",
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  @Post("login")
  async login(@Body() loginDto: loginDto): Promise<{ token: string }> {
    try {
      const token = await this.userUseCases.loginUser(
        loginDto.email,
        loginDto.password
      );
      return { token };
    } catch (error) {
      if (error.message === "User not found") {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error.message === "Invalid password") {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      } else if (error.message) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException(
          "Authentication failed",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
