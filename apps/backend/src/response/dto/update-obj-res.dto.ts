import { ApiProperty } from "@nestjs/swagger"

export class UpdateObjResDto{
    @ApiProperty()
    socialType: string
    @ApiProperty()
    address: string
    @ApiProperty()
    event: string
}