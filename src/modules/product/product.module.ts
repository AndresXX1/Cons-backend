import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Notice } from '@models/Notice.entity';
import { AdminModule } from '@modules/admin/admin.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), forwardRef(() => AdminModule)],
  providers: [ProductService, JwtService, ConfigService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
