import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  value: number;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsBoolean()
  includesShipping: boolean;
}
