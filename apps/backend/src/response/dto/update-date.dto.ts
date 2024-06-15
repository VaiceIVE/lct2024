import { ApiProperty } from "@nestjs/swagger";

export class UpdateDateDto{
    @ApiProperty()
    date: string
}