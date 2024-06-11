import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Prediction } from "./prediction.entity";
import { HeatPoint } from "../../database/entities-index";

@Entity()
export class Event {

    @PrimaryColumn()
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
    object: Obj

    @ManyToOne(() => HeatPoint, (heatPoint) => heatPoint.events)
    heatPoint: HeatPoint

    @ManyToOne(() => Prediction, (pred) => pred.events)
    prediction: Prediction
}
