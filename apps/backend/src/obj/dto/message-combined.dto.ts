import { ApiProperty } from "@nestjs/swagger";
import { HeatPoint } from "../entities/heatpoint.entity";
import { MessageHeatPointDto } from "./message-heatpoint.dto";
import { MessageObjectDto } from "./message-object-dto";

export class CombinedMessageObjectDto
{
    @ApiProperty()
    code: string
    @ApiProperty()
    type?: string
    @ApiProperty()
    heatSource?: string
    @ApiProperty()
    dateStartUsage?: string
    @ApiProperty()
    addressTP?: string
    @ApiProperty()
    authority?: string  
    @ApiProperty() 
    address?: string
    @ApiProperty()
    unom: string
    @ApiProperty()
    material?: string
    @ApiProperty()
    floors?: string
    @ApiProperty()
    heatPointID?: string
    heatPoint?: HeatPoint
    @ApiProperty()
    totalArea?: number
}