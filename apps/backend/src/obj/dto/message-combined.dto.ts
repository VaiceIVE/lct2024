import { HeatPoint } from "../entities/heatpoint.entity";
import { MessageHeatPointDto } from "./message-heatpoint.dto";
import { MessageObjectDto } from "./message-object-dto";

export class CombinedMessageObjectDto
{
    code: string
    type?: string
    heatSource?: string
    dateStartUsage?: string
    addressTP?: string
    authority?: string   
    address?: string
    unom: string
    material?: string
    floors?: string
    heatPointID?: string
    heatPoint?: HeatPoint
    totalArea?: number
}