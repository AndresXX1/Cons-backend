import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  async getActiveCategories() {
    const response = await axios.get('https://back7.maylandlabs.com/api/category/all');

    const categories = response.data.categories;
    const activeCategories = categories.filter((category: any) => category.status === 'activa');

    return activeCategories;
  }
}
