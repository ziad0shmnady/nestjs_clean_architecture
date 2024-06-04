import { Module } from "@nestjs/common";
import { UserController } from "./controllers";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { UserUseCasesModule } from "./use-cases/user/user-use-case.module";
import { JwtStrategy } from "./frameworks/guards/jwt.startegy";

@Module({
  imports: [DataServicesModule, UserUseCasesModule],
  controllers: [UserController],
  providers: [JwtStrategy],
})
export class AppModule {}
