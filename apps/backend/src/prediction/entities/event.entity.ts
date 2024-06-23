import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Prediction } from "./prediction.entity";
import { HeatPoint } from "../../database/entities-index";
import { ObjPrediction } from "./objPrediction.entity";
import { Clusters } from "./cluster.entity";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    eventName: string

    @Column('decimal', {
        precision: 3,
        scale: 2, 
        nullable: true
    })
    chance: number

    @Column()
    date: string

    @ManyToOne(() => Clusters, (cluster) => cluster.events,{
        cascade: ['insert', 'update']
    })
    @JoinColumn()
    cluster: Clusters
}
