import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
//import { Notice } from '@models/Notice.entity';
import { AdminModule } from '@modules/admin/admin.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '@models/Products.entity';
import { AuthService } from '@modules/auth/auth.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserService } from '@modules/user/user.service';
import { User } from '@models/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User]), forwardRef(() => AdminModule), forwardRef(() => AuthModule)],
  providers: [ProductService, JwtService, ConfigService, UserService, AuthService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
