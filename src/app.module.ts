import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { join } from 'path';
import { AppService } from './app.service';
import { DataService } from './scripts/DataService';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModuleOptions } from './config/options';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '@modules/admin/admin.module';
import { BannerModule } from '@modules/banner/banner.module';
import { NoticeModule } from '@modules/notice/notice.module';
import { ProductModule } from '@modules/product/product.module';
import { CuponModule } from '@modules/cupon/cupon.module';
import { BranchModule } from '@modules/branch/branch.module';
import { TimerModule } from '@modules/timer/timer.module';
import { CategoryModule } from '@modules/category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from '@modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleOptions),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'avatar'),
      serveRoot: '/avatar',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'assets'),
      serveRoot: '/assets',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'banner'),
      serveRoot: '/banner',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'notice'),
      serveRoot: '/notice',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'branch'),
      serveRoot: '/branch',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'products'),
      serveRoot: '/images/products',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number | undefined>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
        force: true,
      }),
    }),
    UserModule,
    AuthModule,
    AdminModule,
    BannerModule,
    NoticeModule,
    ProductModule,
    CuponModule,
    BranchModule,
    TimerModule,
    NotificationModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataService],
})
export class AppModule {}
