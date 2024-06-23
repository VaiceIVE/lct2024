import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";
import { HeatPoint, ObjPrediction, Prediction } from "../../database/entities-index";

@Entity()
export class Cluster {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Event, (event) => event.cluster,{
        cascade: true,
        eager: true
    })
    @JoinTable()
    events: Event[]

    @OneToMany(() => ObjPrediction, (obj) => obj.cluster)
    @JoinTable()
    object: ObjPrediction

    @ManyToOne(() => HeatPoint, (hp) => hp.objPredictions)
    @JoinTable()
    heatPoint: HeatPoint

}
