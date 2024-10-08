import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from '@modules/admin/admin.module';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'mercadopago';
import { Timmer } from '@models/Timmer.entity';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { Session } from '@models/Session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timmer, User, Session]), forwardRef(() => AdminModule), forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  providers: [TimerService],
  controllers: [TimerController],
  exports: [TimerService],
})
export class TimerModule {}
