import { IsString, IsDate, IsBoolean, IsNotEmpty, isString, isNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'Introduce un titulo. ' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Introduce un mensaje ' })
  message: string;
  
  @IsString()
  @IsOptional()
  redirect: string;

  @IsDate()
  @IsNotEmpty({ message: 'Introduce una fecha ' })
  scheduledAt: Date;

  @IsBoolean()
  saveInHistory: boolean;

  @IsBoolean()
  isPush: boolean;

}
