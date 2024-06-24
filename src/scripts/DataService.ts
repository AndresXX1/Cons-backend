import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);
  constructor(private readonly userService: UserService) {}

  async loadDataByDefault(): Promise<void> {
    const defaultUsers = [
      {
        email: 'karlosagreda@hotmail.com',
        password: '123456',
        first_name: 'Carlos',
        email_verified: true,
        email_code: '12345',
        federate: 'Amateur',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'joseleonardoagreda@gmail.com',
        password: '123456',
        first_name: 'Leonardo',
        email_verified: true,
        email_code: '12345',
        federate: 'Amateur',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'garciadelriotomas@gmail.com',
        password: '123456',
        first_name: 'Tomas',
        email_verified: true,
        email_code: '12345',
        federate: 'Amateur',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'jfdirazar@gmail.com',
        password: '123456',
        first_name: 'Jose',
        email_verified: true,
        email_code: '12345',
        federate: 'Amateur',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'alexisfajian@gmail.com',
        password: '123456',
        first_name: 'Alexis',
        email_verified: true,
        email_code: '12345',
        federate: 'Amateur',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'carreirafranco@gmail.com',
        first_name: 'Franco',
        password: '123456',
        email_verified: true,
        email_code: '12345',
        federate: 'Amateur',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'Douglasgrl27@gmail.com',
        first_name: 'Douglas',
        password: '123456',
        email_verified: true,
        email_code: '12345',
        federate: 'Federado',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'hofmateo@gmail.com',
        first_name: 'hofmateo',
        password: '123456',
        email_verified: true,
        email_code: '12345',
        federate: 'Federado',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
      {
        email: 'santiagoenriquejordan@gmail.com',
        first_name: 'santiago',
        password: '123456',
        email_verified: true,
        email_code: '12345',
        federate: 'Federado',
        points: Number((Math.random() * 1000).toFixed(0)),
      },
    ];
    for (const user of defaultUsers) {
      this.logger.debug(`creating default user ${user.email} if it does not exist`);
      const userExists = await this.userService.userExistByEmail(user.email);

      if (!userExists) {
        await this.userService.createUserAdmin(user);
      } else {
        await this.userService.updateUser(user);
      }
    }
  }
}
