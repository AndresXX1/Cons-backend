import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Obtiene todas las categorías activas del ecommerce' })
  @Get()
  async getActiveCategories() {
    const categories = await this.categoryService.getActiveCategories();

    return { ok: true, categories };
  }
}
