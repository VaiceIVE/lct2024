import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";
import { HeatPoint, Prediction } from "../../database/entities-index";
import { Cluster } from "./cluster.entity";

@Entity()
export class ObjPrediction {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Cluster, (event) => event.object,{
        cascade: true,
        eager: true
    })
    @JoinTable()
    cluster: Cluster

    @ManyToOne(() => Prediction, (pred) => pred.objPredictions, {
        onDelete: "CASCADE"
    })
    @JoinTable()
    prediction: Prediction

    @ManyToOne(() => Obj, (obj) => obj.objPredictions)
    @JoinTable()
    object: Obj

    @ManyToOne(() => HeatPoint, (hp) => hp.objPredictions)
    @JoinTable()
    heatPoint: HeatPoint
}
