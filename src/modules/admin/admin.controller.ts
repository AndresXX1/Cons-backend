import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Public } from '@infrastructure/decorators/public-route.decorator';
import { LogInDto } from './dto/log-in.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Public()
  @ApiBody({ type: LogInDto })
  @ApiOperation({ summary: 'Logea el admin con email y password' })
  @Post('/log-in')
  async logIn(
    @Body() logInDto: LogInDto,
    @Req()
    request: Request,
  ) {
    const userResponse = await this.adminService.logIn(request, logInDto);
    return userResponse;
  }
}
