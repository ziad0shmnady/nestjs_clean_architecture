import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
