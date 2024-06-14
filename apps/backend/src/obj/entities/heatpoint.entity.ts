import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Obj } from "./obj.entity";
import { Event } from "../../database/entities-index";
import { ObjResponse } from "../../response/entities/objResponse.entity";

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

    @OneToMany(() => Event, (event) => event.heatPoint,{
        onDelete: "CASCADE",
        cascade: true
    })
    @JoinTable()
    events: Event[]

    @OneToMany(() => ObjResponse, (objRes) => objRes.heatPoint)
    @JoinTable()
    objResponses: ObjResponse[]

}
