import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";
import { HeatPoint, Prediction } from "../../database/entities-index";

@Entity()
export class ObjPrediction {

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Event, (event) => event.object,{
        cascade: true,
        eager: true
    })
    @JoinTable()
    events: Event[]

    @OneToMany(() => Prediction, (pred) => pred.objPredictions, {
        onDelete: "CASCADE"
    })
    prediction: Prediction

    @ManyToOne(() => Obj, (obj) => obj.objPredictions)
    @JoinTable()
    object: Obj

    @ManyToOne(() => HeatPoint, (hp) => hp.objPredictions)
    @JoinTable()
    heatPoint: HeatPoint

}
