import { createUserDto } from "../dtos";
import { User } from "../entities";

export class UserMapper {
  static toCreateUserDto(createUserDto: createUserDto): User {
    const user = new User();
    user.email = createUserDto.email;
    user.password_hash = createUserDto.password;
    user.role = createUserDto.role;
    return user;
  }
}
