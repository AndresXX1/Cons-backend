import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ViewType } from '@models/Timmer.entity';

export class RegisterViewTimeDto {
  @ApiProperty({ enum: ViewType, description: 'view' })
  @IsEnum(ViewType)
  @IsNotEmpty()
  view: ViewType;

  @ApiProperty({
    example: 5000,
    description: 'Tiempo de visualización de la vista en segundos. Debe ser un número válido.',
  })
  @IsNumber()
  time: number;
}
