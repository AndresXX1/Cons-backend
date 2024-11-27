import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewImageDto {
  @ApiProperty({ example: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/', description: 'Es la direccion donde se encuentra la imagen' })
  @IsNotEmpty({ message: 'Introduce una uri' })
  @IsString()
  uri: string;

  @ApiProperty({ example: '16709fab-291a-4243-976a-92a2a6720a1d.jpeg', description: 'Es el nombre del archivo y su formato' })
  @IsNotEmpty({ message: 'Introduce un filename.' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'gACQEbAAUAAAABAAAAeg', description: 'Es la imagen codificada' })
  @IsNotEmpty({ message: 'Introduce un código base64.' })
  @IsString()
  base64: string;
}
