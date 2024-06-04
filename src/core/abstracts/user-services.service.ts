import { User } from "../entities";
import { createUserDto } from "src/core/dtos";
export abstract class IUserServices {
  abstract createUserData(createUserDto: createUserDto): Promise<User>;
  abstract findUserByEmail(email: string): Promise<User>;
}
