import { IsString, IsDate, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsDate()
  scheduledAt: Date;

  @IsBoolean()
  saveInHistory: boolean;
}
