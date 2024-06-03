import { PartialType } from "@nestjs/mapped-types";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class InitialRegistrationDto {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/(?=.*[0-9])/, { message: "Password must include one number" })
  @Matches(/(?=.*[A-Z])/, {
    message: "Password must include one uppercase letter",
  })
  password: string;
}

export class CompleteRegistrationDto {
  @IsString()
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;

  @IsString()
  @Matches(/^(\+\d{1,3}[- ]?)?\d{3,15}$/, {
    message: "Invalid phone number format",
  })
  phoneNumber: string;
}

export class passwordDto {
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/(?=.*[0-9])/, { message: "Password must include one number" })
  @Matches(/(?=.*[A-Z])/, {
    message: "Password must include one uppercase letter",
  })
  password: string;
}
export class emailDto {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/(?=.*[0-9])/, { message: "Password must include one number" })
  @Matches(/(?=.*[A-Z])/, {
    message: "Password must include one uppercase letter",
  })
  newPassword: string;
  @IsString()
  @MinLength(8, {
    message: "ConfirmedPassword must be at least 8 characters long",
  })
  @Matches(/(?=.*[0-9])/, { message: "Password must include one number" })
  @Matches(/(?=.*[A-Z])/, {
    message: "ConfirmedPassword must include one uppercase letter",
  })
  confirmPassword: string;
}
