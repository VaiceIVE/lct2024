import { PartialType } from '@nestjs/mapped-types';
import { CreateHeatPointDto } from './create-heatpoint.dto';

export class UpdateHeatPointDto extends PartialType(CreateHeatPointDto) {}
