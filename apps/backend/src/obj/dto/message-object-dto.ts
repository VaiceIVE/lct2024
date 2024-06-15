import { ApiProperty } from "@nestjs/swagger"
import { HeatPoint } from "../entities/heatpoint.entity"
import { CreateHeatPointDto } from "./create-heatpoint.dto"

export class MessageObjectDto{
    @ApiProperty()
    unom: string
    @ApiProperty()
    material?: string
    @ApiProperty()
    type?: string
    @ApiProperty()
    floors?: string
    @ApiProperty()
    heatPointID?: string
    heatPoint?: HeatPoint
    @ApiProperty()
    address?: string 
    @ApiProperty()
    totalArea?: number
}