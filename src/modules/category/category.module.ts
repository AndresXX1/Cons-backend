import { AdminModule } from '@modules/admin/admin.module';
import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [forwardRef(() => AdminModule)],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
