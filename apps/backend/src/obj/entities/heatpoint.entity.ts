import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "./obj.entity";
import { Event } from "../../database/entities-index";
import { ObjResponse } from "../../response/entities/objResponse.entity";
import { ObjPrediction } from "../../prediction/entities/objPrediction.entity";

@Entity()
export class HeatPoint {

    @PrimaryGeneratedColumn()
    id: number
    //9
    @Column(
        {
            nullable: false,
            unique: true
        }
    )
    code: string

    @Column({
        nullable: true
        //ctp itp
    })
    type: string

    @Column({
        nullable: true
    })
    heatSource: string

    @Column({
        nullable: true
    })
    addressTP: string

    @Column({
        nullable: true
    })
    dateStartUsage: string

    //balansoderjatel
    @Column({
        nullable: true
    })
    authority: string

    @Column({
        nullable: true
    })
    geodata: string
    
    @OneToMany(() => Obj, (obj) => obj.heatPoint, {
        onDelete: "SET NULL",
        cascade: true
    })
    @JoinTable()
    objects: Obj[]

    @OneToMany(() => ObjResponse, (objRes) => objRes.heatPoint)
    @JoinTable()
    objResponses: ObjResponse[]

    @OneToMany(() => ObjPrediction, (objRes) => objRes.heatPoint)
    @JoinTable()
    objPredictions: ObjPrediction[]

}
