import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Obj } from "./obj.entity";
import { Event } from "../../database/entities-index";

@Entity()
export class HeatPoint {

    @PrimaryColumn()
    id: number
    //9
    @Column(
        {
            nullable: false
        }
    )
    code: string

    @Column()
    type: string

    @Column()
    heatSource: string

    @Column()
    dateStartUsage: string

    //balansoderjatel
    @Column()
    authority: string

    @Column()
    geodata: string
    
    @OneToMany(() => Obj, (obj) => obj.heatPoint, {
        onDelete: "SET NULL",
        cascade: true
    })
    objects: Obj

    @OneToMany(() => Event, (event) => event.heatPoint,{
        onDelete: "CASCADE",
        cascade: true
    })
    events: Event[]

}
