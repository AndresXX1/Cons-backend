import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({
    example: 'San Fernando',
    description: 'Nombre de la sucursal. Debe contener entre 2 y 100 caracteres.',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un nombre.' })
  name: string;

  @ApiProperty({
    example: 'image.jpg',
    description: 'URL de la imagen de la sucursal. Debe ser una URL válida.',
  })
  @IsString()
  @IsNotEmpty({ message: 'agreguele una imagen a la branch' })
  image: string;

  @ApiProperty({
    example: 'Constitución 198',
    description: 'Dirección de la sucursal. Debe contener entre 10 y 200 caracteres.',
    minLength: 10,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'Introduce una dirección.' })
  address: string;

  @ApiProperty({
    example: 'Lunes a viernes de 9 a 18hs',
    description: 'Horarios de atención de la sucursal. Debe contener entre 10 y 100 caracteres.',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un primer horario de atención' })
  schedules_1: string;

  @ApiProperty({
    example: 'Sábados de 9 a 13hs',
    description: 'Horarios de atención de la sucursal. Debe contener entre 10 y 100 caracteres.',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un segundo horario de atención' })
  schedules_2: string;

  @ApiProperty({
    example: '1123456789',
    description: 'Número de teléfono de la sucursal. Debe ser un número válido.',
  })
  @IsNotEmpty({ message: 'Introduce un número de whatsapp' })
  @IsString()
  whatsapp: string;

  @ApiProperty({
    example: '1123456789',
    description: 'Número de teléfono de la sucursal. Debe ser un número válido.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un número de telefono' })
  phone: string;

  @ApiProperty({
    example: '1123456789',
    description: 'Número de teléfono de la sucursal. Debe ser un número válido.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Introduce una url de googleMaps' })
  url: string;
}
