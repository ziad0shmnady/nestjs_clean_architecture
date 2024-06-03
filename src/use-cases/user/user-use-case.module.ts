import { Module } from "@nestjs/common";
import { DataServicesModule } from "../../services/data-services/data-services.module";
import { UserFactoryService } from "./user.use-case.service";
import { UserUseCases } from "./user.use-case";
import { AuthenticationModule } from "./authentication.module";
import { userDataServicesModule } from "src/services/user-services/user-services.module";

@Module({
  imports: [DataServicesModule, AuthenticationModule, userDataServicesModule],
  providers: [UserFactoryService, UserUseCases],
  exports: [UserFactoryService, UserUseCases, AuthenticationModule],
})
export class UserUseCasesModule {}
