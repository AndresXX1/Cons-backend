import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchProductDto {
  @ApiProperty({ example: 'Samsung', description: 'texto de búsqueda' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ example: '1000', description: 'mínimo precio por el cual consultar productos' })
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ example: '10000', description: 'máximo precio por el cual consultar productos' })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({ example: '[1, 3]', description: 'lista de IDs para filtrar productos por categorías' })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  categoryIds?: number[];

  @ApiProperty({ example: '[2]', description: 'lista de IDs para filtrar productos por marcas' })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  brandIds?: number[];
}
