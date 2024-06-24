import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Genre } from '@models/User.entity';
import { Roles } from '@infrastructure/decorators/role-protected.decorator';

export class EditProfileDto {
  @ApiProperty({ example: 'Jose', description: 'Nombre' })
  @IsOptional()
  @IsString()
  @Length(3, undefined, {
    message: 'El nombre debe tener al menos 3 caracteres.',
  })
  first_name: string;

  @ApiProperty({ example: 'Agreda', description: 'Apellido' })
  @IsOptional()
  @IsString()
  @Length(3, undefined, {
    message: 'El apellido debe tener al menos 3 caracteres.',
  })
  last_name: string;

  @ApiProperty({ example: 25, description: 'Cantidad de puntos de el usuario para el ranking' })
  @IsOptional()
  @IsNumber()
  points?: number;

  @ApiProperty({ example: true, description: 'Se utiliza para saber si el usuario completó el formularion inicial' })
  @IsOptional()
  @IsBoolean()
  completed_welcome_form?: boolean;

  @ApiProperty({ example: true, description: 'Se utiliza para si el usuario esta federado o es amateur' })
  @IsOptional()
  @IsString()
  federate?: string;

  @ApiProperty({ example: '+5492284123456', description: 'Telefono del usuario' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: Roles, description: 'Genero del usuario' })
  @IsOptional()
  @IsString()
  genre: Genre;

  @ApiProperty({ example: new Date(), description: 'Fecha de nacimiento' })
  @IsOptional()
  @IsDate()
  date: Date;
}
