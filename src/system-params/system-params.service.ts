import { Injectable } from '@nestjs/common';
import { CreateSystemParamDto } from './dto/create-system-param.dto';
import { UpdateSystemParamDto } from './dto/update-system-param.dto';

@Injectable()
export class SystemParamsService {
  create(createSystemParamDto: CreateSystemParamDto) {
    return 'This action adds a new systemParam';
  }

  findAll() {
    return `This action returns all systemParams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemParam`;
  }

  update(id: number, updateSystemParamDto: UpdateSystemParamDto) {
    return `This action updates a #${id} systemParam`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemParam`;
  }
}
