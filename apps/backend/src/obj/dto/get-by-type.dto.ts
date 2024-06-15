import { ApiProperty } from "@nestjs/swagger";

export class GetByTypeDto{
    @ApiProperty()
    socialType: string
}