import { Injectable } from "@nestjs/common";
import { User } from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import { UserFactoryService } from "./user.use-case.service";
import { CompleteRegistrationDto, InitialRegistrationDto } from "src/core/dtos";
import { AuthenticationService } from "./authentication.service";
import { IUserServices } from "src/core/abstracts/user-services.service";

@Injectable()
export class UserUseCases {
  constructor(
    private dataServices: IDataServices,
    private userDataService: IUserServices,
    private userFactoryService: UserFactoryService,
    private authService: AuthenticationService
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.dataServices.users.getAll();
  }

  async getUserById(id: string): Promise<User> {
    return await this.dataServices.users.getById(id);
  }

  async initialUserRegistration(
    createUserDto: InitialRegistrationDto
  ): Promise<string> {
    const existingUser = await this.userDataService.findUserByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const passwordHash = await this.authService.hashPassword(
      createUserDto.password
    );
    const user = await this.userFactoryService.createNewUser(
      createUserDto,
      passwordHash
    );
    const token = this.authService.generateVerificationToken(user);

    return token;
  }

  async finalizeUserRegistration(
    token: string,
    additionalUserData: CompleteRegistrationDto
  ): Promise<User> {
    const phoneExists = await this.userDataService.phoneExists(
      additionalUserData.phoneNumber
    );
    if (phoneExists) {
      throw new Error("Phone Number Already Exists!!");
    }
    try {
      const { email, passwordHash } =
        await this.authService.decodeVerificationToken(token);
      const user = this.userFactoryService.createUserEntity(
        email,
        passwordHash,
        additionalUserData
      );

      return await this.dataServices.users.create(await user);
    } catch (error) {
      throw new Error("Invalid or Expired token");
    }
  }

  async sendOtpToUser(phoneNumber: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await "this.sesService.sendOtpSms(phoneNumber, otp);";
  }

  //Login
  async loginUser(email: string, plainPassword: string): Promise<string> {
    const user = await this.userDataService.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    //check if account is already locked

    const isPasswordValid = await this.authService.validateUser(
      plainPassword,
      user.password_hash
    );
    if (!isPasswordValid) {
      await this.userDataService.incrementFailedLoginAttempts(user.user_id);
      const updatedUser = await this.userDataService.findUserByEmail(email);
    }

    return await this.authService.generateLoginToken(user);
  }

  async requestPasswordReset(email: string) {
    const user = await this.userDataService.findUserByEmail(email);

    if (!user) {
      throw new Error("User Not Found");
    }
    const token = await this.authService.generateResetToken(email);
    return "Password Reset Link Sent To Your Email";
  }

  async resetPassword(token: string, newPassword: string) {
    const email = this.authService.validateResetToken(token);
    const hashedPassword = this.authService.hashPassword(newPassword);
    await this.userDataService.resetPassword(await email, await hashedPassword);
  }

  async getUserDetails(userId: string) {
    try {
      const user = await this.userDataService.getUserData(userId);

      return {
        email: user.email,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: any
  ): Promise<User> {
    //checking if email already exists
    if (updateUserProfileDto.email) {
      const user = await this.userDataService.findUserByEmail(
        updateUserProfileDto.email
      );
      if (user) {
        throw new Error("User With This Email Already Exists");
      }
    }
    return await this.dataServices.users.update(userId, updateUserProfileDto);
  }

  async updatePassword(userId: string, updatePasswordDto: any) {
    const user = await this.dataServices.users.getById(userId);
    const passwordDatabaseMatch = await this.authService.validateUser(
      updatePasswordDto.oldPassword,
      user.password_hash
    );
    //if the old password is the same as in the database and the new passwords entry matches
    if (
      passwordDatabaseMatch != null &&
      updatePasswordDto.newPassword == updatePasswordDto.confirmPassword
    ) {
      const password_hash = await this.authService.hashPassword(
        updatePasswordDto.newPassword
      );
      await this.dataServices.users.update(userId, { password_hash });

      return { message: "Password Updated Successfully" };
    } else {
      throw new Error("Wrong Current Password");
    }
  }

  async getEntityUsers(entityIdDto: any) {
    try {
      const users = await this.userDataService.getEntityUsers(
        entityIdDto.entity_id
      );

      if (users) {
        return users;
      } else {
        throw new Error("Entity Not Found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(
    adminId: string,
    unlinkEntity: any,
    updateData: Partial<User>
  ): Promise<{ message: string }> {
    try {
      const isAdminOnEntity = await this.userDataService.checkUserEntity(
        unlinkEntity.entityId,
        adminId
      );

      if (!isAdminOnEntity) {
        throw new Error("You Cannot Delete A User From Another Entity");
      }

      const isUserOnEntity = await this.userDataService.checkUserEntity(
        unlinkEntity.entityId,
        unlinkEntity.user_id
      );

      if (!isUserOnEntity) {
        throw new Error("User Is Not Assigned On This Entity");
      }
      await this.dataServices.users.update(unlinkEntity.user_id, updateData);
      return { message: "User Removed Successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
