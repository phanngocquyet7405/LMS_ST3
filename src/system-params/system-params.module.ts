import { Module } from '@nestjs/common';
import { SystemParamsService } from './system-params.service';
import { SystemParamsController } from './system-params.controller';

@Module({
  controllers: [SystemParamsController],
  providers: [SystemParamsService],
})
export class SystemParamsModule {}
