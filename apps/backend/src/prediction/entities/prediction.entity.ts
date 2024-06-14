import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";

@Entity()
export class Prediction {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    dateCreated: string

    @Column()
    isSaved: boolean

    @OneToMany(() => Event, (event) => event.prediction,{
        onDelete: "CASCADE",
        cascade: true
    })
    @JoinTable()
    events: Event[]

}
