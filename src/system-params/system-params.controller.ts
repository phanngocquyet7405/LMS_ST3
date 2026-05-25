import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemParamsService } from './system-params.service';
import { CreateSystemParamDto } from './dto/create-system-param.dto';
import { UpdateSystemParamDto } from './dto/update-system-param.dto';

@Controller('system-params')
export class SystemParamsController {
  constructor(private readonly systemParamsService: SystemParamsService) {}

  @Post()
  create(@Body() createSystemParamDto: CreateSystemParamDto) {
    return this.systemParamsService.create(createSystemParamDto);
  }

  @Get()
  findAll() {
    return this.systemParamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemParamsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSystemParamDto: UpdateSystemParamDto) {
    return this.systemParamsService.update(+id, updateSystemParamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemParamsService.remove(+id);
  }
}
