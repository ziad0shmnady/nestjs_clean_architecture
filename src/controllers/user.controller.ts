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

@Controller("api/user")
export class UserController {
  constructor(private userUseCases: UserUseCases) {}
}
