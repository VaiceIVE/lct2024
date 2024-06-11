import { PartialType } from '@nestjs/mapped-types';
import { CreateObjDto } from './create-obj.dto';

export class UpdateObjDto extends PartialType(CreateObjDto) {}
