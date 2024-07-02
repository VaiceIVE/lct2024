import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";
import { ObjPrediction } from "./objPrediction.entity";
import * as dayjs from 'dayjs'
import { Prediction } from "./prediction.entity";
import { IPrediction } from "../interfaces/IObjResponse.interface";

@Entity()
export class PredCache {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
    })
    month: string

    @Column({
        type: 'jsonb'
    })
    data: IPrediction

    @ManyToOne(() => Prediction, (op) => op.predCache,{

    })
    @JoinTable()
    prediction: Prediction
}
