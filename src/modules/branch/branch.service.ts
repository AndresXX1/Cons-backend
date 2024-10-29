import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '@models/Branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchService {
  private readonly logger = new Logger(BranchService.name);

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
}
