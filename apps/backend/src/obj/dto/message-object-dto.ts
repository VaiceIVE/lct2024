import { HeatPoint } from "../entities/heatpoint.entity"
import { CreateHeatPointDto } from "./create-heatpoint.dto"

export class MessageObjectDto{
    unom: string
    material?: string
    type?: string
    floors?: string
    heatPointID?: string
    heatPoint?: HeatPoint
    address?: string 
    totalArea?: number
}