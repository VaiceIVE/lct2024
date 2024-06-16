import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Prediction } from "./prediction.entity";
import { HeatPoint } from "../../database/entities-index";
import { ObjPrediction } from "./objPrediction.entity";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    eventName: string

    @Column()
    chance: number

    @Column()
    date: string

    @ManyToOne(() => ObjPrediction, (obj) => obj.events, {
        onDelete: "CASCADE",
        eager: true
    })
    @JoinTable()
    object: ObjPrediction
}
