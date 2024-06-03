import { Injectable } from "@nestjs/common";
import { User } from "../../../core/entities";
import { IUserServices } from "../../../core/abstracts/user-services.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class userService implements IUserServices {
  private prismaService: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }
  phoneExists(phoneNumber: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateUserProfile(userId: string, updateUserProfileDto: any): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findUserByEmail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  incrementFailedLoginAttempts(userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  resetPassword(email: string, password: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getEntityUsers(entityId: string) {
    throw new Error("Method not implemented.");
  }
  checkUserEntity(entityId: string, user_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  resetFailedLoginAttempts(userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  //members management

  //profile details
  async getUserData(user_id: string): Promise<any> {
    return await this.prismaService.user.findUnique({
      where: { user_id: user_id },
      select: {
        email: true,
      },
    });
  }
}
