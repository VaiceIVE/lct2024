import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Obj } from "./obj.entity";

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
    
    @OneToMany(() => Obj, (obj) => obj.heatPoint, {
        onDelete: "SET NULL",
        cascade: true
    })
    objects: Obj

}
