import { ApiProperty } from "@nestjs/swagger"

export class DeleteObjResDto
{
    @ApiProperty()
    socialType: string
    @ApiProperty()
    address: string
}