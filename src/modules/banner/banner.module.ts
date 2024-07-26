import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Banner } from '@models/Banner.entity';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { AdminModule } from '@modules/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), forwardRef(() => AdminModule)],
  providers: [BannerService, JwtService, ConfigService],
  controllers: [BannerController],
  exports: [BannerService],
})
export class BannerModule {}
