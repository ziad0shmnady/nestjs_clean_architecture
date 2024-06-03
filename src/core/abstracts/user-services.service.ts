import { User } from "../entities";

export abstract class IUserServices {
  abstract phoneExists(phoneNumber: string): Promise<boolean>;
  abstract resetPassword(email: string, password: string): Promise<User>;
  abstract updateUserProfile(
    userId: string,
    updateUserProfileDto: any
  ): Promise<User | null>;
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract getEntityUsers(entityId: string);
  abstract checkUserEntity(entityId: string, user_id: string): Promise<boolean>;
  abstract incrementFailedLoginAttempts(userId: string): Promise<void>;
  abstract resetFailedLoginAttempts(userId: string): Promise<void>;
  abstract getUserData(user_id: string): Promise<Partial<User>>;
}
