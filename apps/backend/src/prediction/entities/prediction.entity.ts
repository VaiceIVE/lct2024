import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";
import { ObjPrediction } from "./objPrediction.entity";
import * as dayjs from 'dayjs'
import { PredCache } from "./predcache.entity";

@Entity()
export class Prediction {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: dayjs(new Date())
    })
    dateCreated: string

    @Column({
        default: false
    })
    isSaved: boolean

    @Column({
        default: false
    })
    isDefault: boolean

    @OneToMany(() => ObjPrediction, (op) => op.prediction,{
        cascade: true,
        eager: true
    })
    @JoinTable()
    objPredictions: ObjPrediction[]

    @OneToMany(() => PredCache, (op) => op.prediction,{
        cascade: true,
        eager: true
    })
    @JoinTable()
    predCache: PredCache[]
}
