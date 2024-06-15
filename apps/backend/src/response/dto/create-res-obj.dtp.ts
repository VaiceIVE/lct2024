import { ApiProperty } from "@nestjs/swagger"

export class CreateResObjDto
{
    @ApiProperty()
    socialType: string
    @ApiProperty()
    address: string
    @ApiProperty()
    event: string
}