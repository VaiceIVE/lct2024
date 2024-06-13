import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { HeatPoint } from "./heatpoint.entity";
import { Event } from "../../prediction/entities/event.entity";

@Entity()
export class Obj {

    @PrimaryColumn()
    id: number
    //9
    @Column({
        nullable: false
    })
    unom: string

    @Column()
    address: string

    @Column()
    wallMaterial: string

    @Column()
    floorsAmount: number

    @Column()
    totalArea: number

    @Column()
    objType: string
    //svoi po 9
    @Column()
    isImportant: boolean
    //14
    @Column()
    entranceAmount: number

    @Column()
    flatsAmount: number

    @Column()
    btuwear: number
    // po 7 all TP 
    @Column()
    geodata: string

    @ManyToOne(() => HeatPoint, (heatPoint) => heatPoint.objects)
    heatPoint: HeatPoint

    @OneToMany(() => Event, (event) => event.object,{
        onDelete: "CASCADE",
        cascade: true
    })
    events: Event[]
}
