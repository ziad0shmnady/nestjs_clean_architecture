import { Module } from "@nestjs/common";
import { IUserServices } from "src/core/abstracts/user-services.service";
import { userService } from "./user.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthenticationModule } from "src/use-cases/user/authentication.module";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  providers: [
    {
      provide: IUserServices,
      useClass: userService,
    },
  ],
  exports: [IUserServices],
})
export class userServicesModule {}
