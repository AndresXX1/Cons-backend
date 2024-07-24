import * as bcrypt from 'bcrypt';
import { Not, Repository } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@models/User.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // Used in loadDataByDefault
  async createUserAdmin(user: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = new User();
    newUser.email = user.email as string;
    newUser.password = hashedPassword;
    newUser.email_code = user.email_code as string;
    newUser.email_verified = user.email_verified as boolean;
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async createUser(email: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const randomNumber = Math.floor(Math.random() * 100000);
    const emailVerificationCode = randomNumber.toString().padStart(5, '0');

    await this.sendEmail(email, emailVerificationCode);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.email_code = emailVerificationCode;
    //user.email_code_create_at = Date.now()
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async sendEmail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('nodemailer.from'),
        subject: 'Argenpesos: Verifica tu correo electronico',
        template: 'index',
        context: {
          code,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendEmailOwner(email: string, code: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('nodemailer.from'),
        subject: 'Argenpesos: Verifica tu correo electronico Owner',
        template: 'owner',
        context: {
          code,
          password,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendEmailToVerifyMatchResults(email: string, author: string, link: string) {
    try {
      const response = await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('nodemailer.from'),
        subject: `Argenpesos: ${author} ah indicado que participaste de una partida`,
        template: 'verify-match-results',
        context: {
          author,
          link,
        },
      });
      console.log({ response });
    } catch (error) {
      console.log(error);
    }
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }
    return user;
  }

  async findByIdWithoutRelations(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }
    return user;
  }

  async findByIdSocket(userId: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return undefined;
    }
    return user;
  }

  async userExistByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.userRepository.createQueryBuilder('user').select('user.password').where('user.email = :email', { email }).getRawOne();

    if (user) return user.user_password;

    return null;
  }

  async updateLastLogin(user: User): Promise<User> {
    user.last_login = new Date();
    return this.userRepository.save(user);
  }

  async changeAvatar(userId: number, avatar: string): Promise<User> {
    const user = await this.findById(userId);
    user.avatar = avatar;
    return this.userRepository.save(user);
  }

  async createWithGoogle(email: string): Promise<User> {
    const password = this.generateRandomPassword();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.email_verified = true;

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  generateRandomPassword(): string {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.';
    let password = '';

    for (let i = 0; i < 14; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      password += caracteres.charAt(indice);
    }

    password += '@.';

    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return password;
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({});
  }

  async getAllUsers(userId: number, data: { first: number; second: number }): Promise<User[]> {
    const response = await this.userRepository.find({
      where: {
        id: Not(userId),
      },
    });
    const slicedResponse = response.slice(data.first, data.second);
    return slicedResponse;
  }

  async verifyEmailCode(code: string, userId: number) {
    const userEmailCode = await this.userRepository.createQueryBuilder('user').select('user.email_code').where('user.id = :id', { id: userId }).getRawOne();
    if (userEmailCode.user_email_code === code) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
      }
      user.email_verified = true;
      user.email_code = '';
      await this.userRepository.save(user);
      return { ok: true, message: 'Email verificado.' };
    }

    return { ok: false, message: 'El codigo es incorrecto.' };
  }

  async getUsersByIds(userIds: number[]): Promise<User[]> {
    const users = await this.userRepository.find({
      where: userIds.map((id) => ({ id })),
    });
    return users;
  }

  async changePassword(email: string, newPassword): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Correo electrónico no registrado.');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.email_verified = true;
    user.password = hashedPassword;

    const userSaved = await this.userRepository.save(user);
    return userSaved;
  }

  async updateUser(user: Partial<User>) {
    const dbUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (!dbUser) throw new NotFoundException('Correo electrónico no registado');
    for (const property in user) {
      if (property === 'password') {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        dbUser.password = hashedPassword;
      } else if (user[property]) {
        dbUser[property] = user[property];
      }
    }
    await this.userRepository.update(dbUser.id as number, dbUser);

    return { ok: true, message: 'User updated' };
  }

  async findUserDataById(userId: number): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }
    return user;
  }
}
