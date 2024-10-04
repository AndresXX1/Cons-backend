import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TimerService } from './timer.service';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RegisterViewTimeDto } from './dto/register-view-time.dto';
import { User } from '@models/User.entity';

@Controller('timer')
@ApiTags('timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene tu datos de usuario' })
  @ApiBearerAuth()
  @Post('')
  async getProfile(@GetUser() user: User, @Body() registerViewTimeDto: RegisterViewTimeDto) {
    await this.timerService.registerViewTime(registerViewTimeDto, user);
    return { ok: true };
  }
}
