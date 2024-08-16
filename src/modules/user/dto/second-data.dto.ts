import { IsNotEmpty, IsDate, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSecondDataDto {
  @ApiProperty({ example: '1989-05-24', description: 'Fecha de nacimiento' })
  @IsDate({ message: 'Introduce una fecha válida.' })
  @IsNotEmpty({ message: 'Introduce una fecha de nacimiento.' })
  birthday: Date;

  @ApiProperty({ example: '1123456789', description: 'Número de teléfono' })
  @IsPhoneNumber('AR', { message: 'Introduce un número de teléfono válido para Argentina.' })
  @IsNotEmpty({ message: 'Introduce un número de teléfono.' })
  phone: string;
}
