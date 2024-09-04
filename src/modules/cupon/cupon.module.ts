import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Notice } from '@models/Notice.entity';
import { AdminModule } from '@modules/admin/admin.module';
import { CuponController } from './cupon.controller';
import { CuponService } from './cupon.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), forwardRef(() => AdminModule)],
  providers: [CuponService, JwtService, ConfigService],
  controllers: [CuponController],
  exports: [CuponService],
})
export class CuponModule {}
