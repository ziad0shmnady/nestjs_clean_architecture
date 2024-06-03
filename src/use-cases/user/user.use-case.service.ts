import { Injectable } from "@nestjs/common";
import { User } from "../../core/entities";
import { CompleteRegistrationDto, InitialRegistrationDto } from "src/core/dtos";

@Injectable()
export class UserFactoryService {
  //For Email Verification only
  async createNewUser(
    createUserDto: InitialRegistrationDto,
    hashedPassword: string
  ) {
    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.password_hash = hashedPassword;
    return newUser;
  }
  async createUserEntity(
    email: string,
    passwordHash: string,
    additionalUserData: CompleteRegistrationDto
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.password_hash = passwordHash;

    return user;
  }

  updateUser(updateUserDto: any) {
    const newUser = new User();
    newUser.email = updateUserDto.email;
    return newUser;
  }
}
