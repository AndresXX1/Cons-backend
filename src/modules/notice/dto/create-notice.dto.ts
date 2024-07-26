import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ example: '¡No te olvides de la PROMO REFERIDOS!', description: 'Titulo' })
  @IsString()
  @IsNotEmpty({ message: 'Introduce un titulo. ' })
  title: string;

  @ApiProperty({ example: 'Porque recomendar a un amigo o familiar en nuestras sucursales tiene beneficios para ellos y para vos ....', description: 'Descripcion' })
  @IsString()
  @IsNotEmpty({ message: 'Introduce una descripcion. ' })
  description: string;

  @ApiProperty({ example: '1123456789' })
  @IsNotEmpty({ message: 'Introduce un numero telefonico. ' })
  url: string;

  @ApiProperty({ example: '01/12/2024' })
  @IsNotEmpty({ message: 'Introduce una fecha' })
  date: string;
}
