import { ApiProperty } from "@nestjs/swagger";
import { CombinedMessageObjectDto } from "./message-combined.dto";
import { MessageObjectDto } from "./message-object-dto";

export class MessageDto{
    @ApiProperty({type: () => CombinedMessageObjectDto})
    data: CombinedMessageObjectDto[]
}