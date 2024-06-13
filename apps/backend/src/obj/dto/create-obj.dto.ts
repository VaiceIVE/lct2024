import { CreateHeatPointDto } from "./create-heatpoint.dto"

export class CreateObjDto {
    unom: string
    address?: string
    heatPointID?: string
    wallMaterial?: string
    floorsAmount?: number
    totalArea?: number
    objType?: string
    isImportant?: boolean
    entranceAmount?: number
    flatsAmount?: number
    btuwear?: number
    geodata?: string
    heatPoint?: CreateHeatPointDto
}
