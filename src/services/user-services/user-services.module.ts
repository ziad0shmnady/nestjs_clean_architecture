import { Module } from '@nestjs/common';
import { userServicesModule } from 'src/frameworks/data-services/user/user.module';

@Module({
  imports: [userServicesModule],
  exports: [userServicesModule],
})
export class userDataServicesModule {}
