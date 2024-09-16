import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
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
  schedules_1: string;

  @ApiProperty({
    example: 'Sábados de 9 a 13hs',
    description: 'Horarios de atención de la sucursal. Debe contener entre 10 y 100 caracteres.',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  schedules_2: string;

  @ApiProperty({
    example: '1123456789',
    description: 'Número de teléfono de la sucursal. Debe ser un número válido.',
  })
  @IsString()
  whatsapp: string;

  @ApiProperty({
    example: '1123456789',
    description: 'Número de teléfono de la sucursal. Debe ser un número válido.',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: -34.6037,
    description: 'Latitud de la ubicación de la sucursal. Debe ser un número válido entre -90 y 90.',
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90, { message: 'La latitud debe ser mayor o igual a -90.' })
  @Max(90, { message: 'La latitud debe ser menor o igual a 90.' })
  lat: number;

  @ApiProperty({
    example: -58.3816,
    description: 'Longitud de la ubicación de la sucursal. Debe ser un número válido entre -180 y 180.',
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180, { message: 'La longitud debe ser mayor o igual a -180.' })
  @Max(180, { message: 'La longitud debe ser menor o igual a 180.' })
  lon: number;
}
