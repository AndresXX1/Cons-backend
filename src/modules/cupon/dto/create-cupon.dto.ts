import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCuponDto {
  @ApiProperty({ example: 11447, description: 'id del cupon' })
  @IsNumber({}, { message: 'Introduce el id' })
  @IsNotEmpty({ message: 'Introduce un titulo. ' })
  id: number;
}
