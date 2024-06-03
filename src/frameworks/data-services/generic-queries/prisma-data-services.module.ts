// frameworks/data-services/prisma-data-services.module.ts
import { Module } from '@nestjs/common';
import { PrismaDataService } from './prisma-data-services.service';
import { IDataServices } from 'src/core/abstracts';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: IDataServices,
      useClass: PrismaDataService,
    },
  ],
  exports: [IDataServices],
})
export class PrismaDataServicesModule {}
