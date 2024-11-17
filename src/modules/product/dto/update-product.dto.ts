import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  value?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;


  @IsOptional()  
  @IsString()    
  @ApiProperty({ type: 'string', format: 'binary', required: false }) 
  image?: string;  

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  includesShipping?: boolean;
}
