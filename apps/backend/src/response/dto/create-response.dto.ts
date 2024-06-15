import { ApiProperty } from "@nestjs/swagger";

export class CreateResponseDto {
    @ApiProperty()
    userId: number
}
