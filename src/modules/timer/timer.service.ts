import { Timmer } from '@models/Timmer.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterViewTimeDto } from './dto/register-view-time.dto';
import { User } from '@models/User.entity';
import { Between, MoreThan } from 'typeorm';

@Injectable()
export class TimerService {
  private readonly logger = new Logger(TimerService.name);

  constructor(
    @InjectRepository(Timmer)
    private readonly timerRepository: Repository<Timmer>,
  ) {}

  async registerViewTime(registerViewTimeDto: RegisterViewTimeDto, user: User): Promise<Timmer> {
    const { view, time } = registerViewTimeDto;
    const timer = new Timmer();
    timer.view = view;
    timer.time = time;
    timer.user = user;
    await this.timerRepository.save(timer);
    return timer;
  }

  async getTimers(): Promise<{
    last_week: {
      home: number;
      cuponizate: number;
      argencompras: number;
      profile: number;
    };
    these_week: {
      home: number;
      cuponizate: number;
      argencompras: number;
      profile: number;
    };
  }> {
    const lastWeekStart = new Date();
    const lastWeekEnd = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1); // Hasta el día anterior

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7); // Desde el inicio de esta semana

    // Obtener datos de la semana pasada
    const lastWeekTimers = await this.timerRepository.find({
      where: {
        create: Between(lastWeekStart, lastWeekEnd), // Filtrar por fecha
      },
    });

    // Obtener datos de esta semana
    const thisWeekTimers = await this.timerRepository.find({
      where: {
        create: MoreThan(thisWeekStart), // Desde el inicio de esta semana
      },
    });

    const lastWeekData = {
      home: 0,
      cuponizate: 0,
      argencompras: 0,
      profile: 0,
    };

    const thisWeekData = {
      home: 0,
      cuponizate: 0,
      argencompras: 0,
      profile: 0,
    };

    // Acumular tiempos de la semana pasada
    lastWeekTimers.forEach((timer) => {
      lastWeekData[timer.view] += timer.time;
    });

    // Acumular tiempos de esta semana
    thisWeekTimers.forEach((timer) => {
      thisWeekData[timer.view] += timer.time;
    });

    return {
      last_week: lastWeekData,
      these_week: thisWeekData,
    };
  }
}
