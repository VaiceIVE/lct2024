import { ApiProperty } from "@nestjs/swagger"

export class CreateHeatPointDto{
    @ApiProperty()
    code: string
    @ApiProperty()
    type?: string
    @ApiProperty()
    heatSource?: string
    @ApiProperty()
    dateStartUsage?: string
    @ApiProperty()
    authority?: string
    @ApiProperty()
    addressTP?: string
}