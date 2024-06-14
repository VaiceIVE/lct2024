import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ObjResponse } from "./objResponse.entity";
import { User } from "../../database/entities-index";
@Entity()
export class Response {

    @PrimaryGeneratedColumn()
    id: number

    @Column(
        {
            default: '15 Января'
        }
    )
    date: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @OneToMany(() => ObjResponse, (objRes) => objRes.response)
    @JoinTable()
    objects: ObjResponse[]
}
