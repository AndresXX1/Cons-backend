import { IsString, IsDate, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'Introduce un titulo. ' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Introduce un mensaje ' })
  message: string;

  @IsDate()
  @IsNotEmpty({ message: 'Introduce una fecha ' })
  scheduledAt: Date;

  @IsBoolean()
  saveInHistory: boolean;

  @IsBoolean()
  isPush: boolean;
}
