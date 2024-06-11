import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";

@Entity()
export class Prediction {

    @PrimaryColumn()
    id: number

    @Column()
    dateCreated: string

    @Column()
    isSaved: boolean

    @OneToMany(() => Event, (event) => event.prediction,{
        onDelete: "CASCADE",
        cascade: true
    })
    events: Event[]

}
