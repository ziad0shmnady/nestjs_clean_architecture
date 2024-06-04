import { $Enums } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsString()
  @IsOptional()
  role?: $Enums.EntityUsers;
}
