import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminModule } from '@modules/admin/admin.module';
import { Branch } from '@models/Branch.entity';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), forwardRef(() => AdminModule)],
  providers: [BranchService, JwtService, ConfigService],
  controllers: [BranchController],
  exports: [BranchService],
})
export class BranchModule {}
