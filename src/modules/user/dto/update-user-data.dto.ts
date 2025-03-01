import {
  IsString,
  IsNumberString,
  Length,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
  IsDate,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { subYears } from 'date-fns';

export function IsAdult(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'isAdult',
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date) {
          const today = new Date();
          const date18YearsAgo = subYears(today, 18); // resta 18 años a la fecha actual
          return value <= date18YearsAgo; // Verifica si la fecha de nacimiento es menor o igual a la fecha de hace 18 años
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(args: ValidationArguments) {
          return 'Debes tener al menos 18 años para registrarte.';
        },
      },
    });
  };
}

export class updateUserDataDto {
  @ApiProperty({ example: 'Jose', description: 'Nombre' })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(28, { message: 'El nombre no debe exceder los 28 caracteres.' })
  @Matches(/^\S.*\S$|^\S$/, { message: 'El nombre no puede tener espacios al inicio o al final.' })
  first_name: string;

  @ApiProperty({ example: 'Agreda', description: 'Apellido' })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
  @MaxLength(28, { message: 'El apellido no debe exceder los 28 caracteres.' })
  @Matches(/^\S.*\S$|^\S$/, { message: 'El apellido no puede tener espacios al inicio o al final.' })
  last_name: string;

  @ApiProperty({ example: '20123456789', description: 'CUIL' })
  @IsNumberString({ no_symbols: true }, { message: 'El CUIL debe contener solo números.' })
  @Length(11, 11, { message: 'El CUIL debe tener 11 dígitos.' })
  @IsOptional()
  cuil: string;

  @ApiProperty({ example: '1989-05-24', description: 'Fecha de nacimiento' })
  @IsDate({ message: 'Introduce una fecha válida.' })
  @IsOptional()
  @IsAdult({ message: 'Debes tener al menos 18 años para registrarte.' })
  birthday: Date;

  @ApiProperty({ example: '1123456789', description: 'Número de teléfono' })
  @IsPhoneNumber('AR', { message: 'Introduce un número de teléfono válido para Argentina.' })
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 100, description: 'Puntos acumulados por el usuario' })
  @IsNumber()
  @IsOptional()
  points: number;

  @ApiProperty({ example: 'M', description: 'Género del usuario' })
  @IsString()
  @IsOptional()
  gender: string;
}

