import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Notice } from '@models/Notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [NoticeService, JwtService, ConfigService],
  controllers: [NoticeController],
  exports: [NoticeService],
})
export class NoticeModule {}
