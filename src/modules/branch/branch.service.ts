import { Injectable, Logger } from '@nestjs/common';
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
    branch.lat = createBranchDto.lat;
    branch.lon = createBranchDto.lon;
    return await this.bannerRepository.save(branch);
  }
}
