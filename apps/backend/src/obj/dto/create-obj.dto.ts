import { ApiProperty } from "@nestjs/swagger"
import { HeatPoint } from "../entities/heatpoint.entity"
import { CreateHeatPointDto } from "./create-heatpoint.dto"

export class CreateObjDto {
    @ApiProperty()
    unom: string
    @ApiProperty()
    address?: string
    @ApiProperty()
    heatPointID?: string
    @ApiProperty()
    wallMaterial?: string
    @ApiProperty()
    floorsAmount?: number
    @ApiProperty()
    totalArea?: number
    @ApiProperty()
    objType?: string
    @ApiProperty()
    socialType?:  "education" | "medicine" | "mkd" | "prom"
    @ApiProperty()
    entranceAmount?: number
    @ApiProperty()
    flatsAmount?: number
    @ApiProperty()
    btuwear?: number
    @ApiProperty()
    geodata?: string
    heatPoint?: HeatPoint
}
