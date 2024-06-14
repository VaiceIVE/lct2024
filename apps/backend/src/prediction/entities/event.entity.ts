import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Prediction } from "./prediction.entity";
import { HeatPoint } from "../../database/entities-index";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    EventName: string

    @Column()
    probability: number

    @Column()
    approxDate: string

    @Column()
    affectedConsumers: number

    @Column()
    cooldown: number

    @ManyToOne(() => Obj, (obj) => obj.events)
    @JoinTable()
    object: Obj

    @ManyToOne(() => HeatPoint, (heatPoint) => heatPoint.events)
    @JoinTable()
    heatPoint: HeatPoint

    @ManyToOne(() => Prediction, (pred) => pred.events)
    @JoinTable()
    prediction: Prediction
}
