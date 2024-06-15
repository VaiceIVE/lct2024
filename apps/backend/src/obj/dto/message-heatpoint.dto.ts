import { ApiProperty } from "@nestjs/swagger"

export class MessageHeatPointDto{
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
}