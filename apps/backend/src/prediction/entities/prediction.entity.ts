import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "../../obj/entities/obj.entity";
import { Event } from "./event.entity";
import { ObjPrediction } from "./objPrediction.entity";

@Entity()
export class Prediction {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: new Date
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
}
