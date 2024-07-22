import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LogInDto } from './dto/log-in.dto';
import { Admin } from '@models/Admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SessionAdmin } from '@models/SessionAdmin.entity';
import * as DeviceDetector from 'device-detector-js';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

class AccessRefreshTokenAdminGenerated {
  sessionAdmin: SessionAdmin;
  refreshToken: string;
}

@Injectable()
export class AdminService {
  private readonly deviceDetector = new DeviceDetector();
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(SessionAdmin)
    private readonly sessionAdminRepository: Repository<SessionAdmin>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  extractIpAddress(fullIpAddress: string): string {
    const ipAddressParts = fullIpAddress.split(':');
    if (ipAddressParts.length >= 2) {
      return ipAddressParts[ipAddressParts.length - 1];
    } else {
      return '0.0.0.0';
    }
  }

  async logIn(req, logInDto: LogInDto) {
    const admin = await this.adminExistByEmail(logInDto.email);

    if (!admin) {
      throw new NotFoundException('El Administrador no existe.');
    }
    const adminPassword = await this.findByEmailWithPassword(logInDto.email);
    if (!bcrypt.compareSync(logInDto.password, adminPassword)) {
      throw new UnauthorizedException('Contraseña no válida.');
    }
    await this.updateLastLogin(admin);
    const { refreshToken, sessionAdmin } = await this.generateAccessRefreshToken(req, admin);

    const token = await this.generateAccessToken(admin.id, sessionAdmin.id);

    return {
      ok: true,
      token,
      refreshToken,
    };
  }

  async adminExistByEmail(email: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({ where: { email: email } });
    return admin;
  }

  async findByEmailWithPassword(email: string): Promise<Admin | null> {
    const admin = await this.adminRepository.createQueryBuilder('admin').select('admin.password').where('admin.email = :email', { email }).getRawOne();
    if (admin) return admin.admin_password;
    return null;
  }

  async updateLastLogin(admin: Admin): Promise<Admin> {
    admin.last_login = new Date();
    return this.adminRepository.save(admin);
  }

  async generateAccessRefreshToken(req, admin: Admin): Promise<AccessRefreshTokenAdminGenerated> {
    const sessionAdmin = await this.createSessionAdmin(req, admin);

    const payload = { userId: admin.id, sessionId: sessionAdmin.id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('session.secretKeyRefresh'),
      expiresIn: this.configService.get<string>('session.jwtTokenRefreshExpiration'),
    });

    return { refreshToken, sessionAdmin };
  }

  async generateAccessToken(userId, sessionId): Promise<string> {
    const payload = { userId: userId, sessionId: sessionId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('session.secretKey'),
      expiresIn: this.configService.get<string>('session.jwtTokenExpiration'),
    });

    return accessToken;
  }

  async createSessionAdmin(req, admin: Admin): Promise<SessionAdmin> {
    const jwtTokenRefreshExpiration: number = this.configService.get<number>('session.jwtTokenRefreshExpiration') ?? 604800; // 1 semana

    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + jwtTokenRefreshExpiration);

    const sessionAdmin = new SessionAdmin();

    const ExtraInfo = this.deviceDetector.parse(req.headers['user-agent']);

    const ipAddress = req?.ip || '0.0.0.0';
    const browser = ExtraInfo?.client?.name || 'undefined';
    const operatingSystem = ExtraInfo?.os?.name || 'undefined';

    sessionAdmin.admin = admin;
    sessionAdmin.ip = this.extractIpAddress(ipAddress);
    sessionAdmin.browser = browser;
    sessionAdmin.operatingSystem = operatingSystem;
    sessionAdmin.expiredAt = expiredAt;

    return this.sessionAdminRepository.save(sessionAdmin);
  }

  async createAdmin(user: Partial<Admin>): Promise<Admin> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newAdmin = new Admin();
    newAdmin.email = user.email as string;
    newAdmin.password = hashedPassword;
    newAdmin.email_code = user.email_code as string;
    const savedAdmin = await this.adminRepository.save(newAdmin);
    return savedAdmin;
  }
}
