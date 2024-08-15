import { IsNotEmpty, IsString, IsNumberString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFirstDataDto {
  @ApiProperty({ example: 'Jose', description: 'Nombre' })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un nombre.' })
  first_name: string;

  @ApiProperty({ example: 'Agreda', description: 'Apellido' })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un apellido.' })
  last_name: string;

  @ApiProperty({ example: '20123456789', description: 'CUIL' })
  @IsNumberString({ no_symbols: true }, { message: 'El CUIL debe contener solo números.' })
  @Length(11, 11, { message: 'El CUIL debe tener exactamente 11 dígitos.' })
  @IsNotEmpty({ message: 'Introduce un número de CUIL.' })
  cuil: string;
}
