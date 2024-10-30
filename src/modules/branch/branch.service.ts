import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '@models/Branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import axios from 'axios';
import { User } from '@models/User.entity';

@Injectable()
export class BranchService {
  private readonly logger = new Logger(BranchService.name);
  private readonly ticket = '5B0FA15E-7FA0-4510-9C54-F74CC4059E30';
  private readonly smarterBaseUrl = 'http://smarter.argenpesos.com.ar:30002';
  private readonly userRepository: Repository<User>;

  constructor(
    @InjectRepository(Branch)
    private readonly bannerRepository: Repository<Branch>,
  ) {}

  async getBranches(): Promise<Branch[]> {
    const branches = await this.bannerRepository.find({});
    return branches;
  }

  async createBranch(createBranchDto: CreateBranchDto): Promise<Branch> {
    const branch = new Branch();
    branch.name = createBranchDto.name;
    branch.image = createBranchDto.image;
    branch.address = createBranchDto.address;
    branch.schedules_1 = createBranchDto.schedules_1;
    branch.schedules_2 = createBranchDto.schedules_2;
    branch.whatsapp = createBranchDto.whatsapp;
    branch.phone = createBranchDto.phone;
    branch.url = createBranchDto.url;
    return await this.bannerRepository.save(branch);
  }

  async UpdateBranch(userid: number, updateBranchDto: CreateBranchDto): Promise<Branch> {
    const branch = await this.bannerRepository.findOne({ where: { id: userid } });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${userid} not found`);
    }

    branch.name = updateBranchDto.name;
    branch.image = updateBranchDto.image;
    branch.address = updateBranchDto.address;
    branch.schedules_1 = updateBranchDto.schedules_1;
    branch.schedules_2 = updateBranchDto.schedules_2;
    branch.whatsapp = updateBranchDto.whatsapp;
    branch.phone = updateBranchDto.phone;
    branch.url = updateBranchDto.url;

    return await this.bannerRepository.save(branch);
  }

  async deleteBranch(userId: number): Promise<Branch> {
    const branch = await this.bannerRepository.findOne({
      where: { id: userId },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${userId} not found`);
    }

    return await this.bannerRepository.remove(branch);
  }

  async getCoupon(userId: number, branchName: string, platform: number) {
    const userFound = await this.userRepository?.findOne({ where: { id: userId } });
    if (!userFound) throw new NotFoundException('[ user | getCoupon ]: No se encontró el usuario');

    const params2 = {
      cuil: userFound.cuil,
      ticket: this.ticket,
      token: userFound.smarter_token,
      usuario: branchName,
      productoId: platform,
    };

    try {
      const response = await axios.get(`${this.smarterBaseUrl}/External/app_consultacupo`, { params: params2 });

      if (response.status === 200 && response.data.statusCode === 201) {
        const { resultado, maximoCapital, maximoCuota, respuestaMotor, consultaId } = response.data.result || {};

        return {
          resultado: resultado || '',
          maximoCapital: maximoCapital?.toString() || '0',
          maximoCuota: maximoCuota?.toString() || '0',
          respuestaMotor: respuestaMotor || '',
          consultaId: consultaId || '',
        };
      }

      return undefined;
    } catch (error) {
      throw new Error(`[ branchService | getCoupon ]: Error en la llamada a la API externa: ${error.message}`);
    }
  }
}
