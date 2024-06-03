import { Module } from "@nestjs/common";
import { PrismaDataServicesModule } from "src/frameworks/data-services/generic-queries/prisma-data-services.module";

@Module({
  imports: [PrismaDataServicesModule],
  exports: [PrismaDataServicesModule],
})
export class DataServicesModule {}
