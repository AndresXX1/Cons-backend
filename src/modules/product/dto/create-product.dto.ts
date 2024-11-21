import { IsString, IsInt, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  value: number;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  description: string;

  @IsOptional()  
  @IsString()   
  @ApiProperty({ type: 'string', format: 'binary', required: false })  
  image?: string;  

  @ApiProperty()
  @IsBoolean()
  includesShipping: boolean;
}
