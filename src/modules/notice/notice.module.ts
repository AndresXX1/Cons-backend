import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Notice } from '@models/Notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { AdminModule } from '@modules/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), forwardRef(() => AdminModule)],
  providers: [NoticeService, JwtService, ConfigService],
  controllers: [NoticeController],
  exports: [NoticeService],
})
export class NoticeModule {}
