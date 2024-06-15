import {Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { Response } from './response.entity'
import { HeatPoint, Obj } from '../../database/entities-index'
@Entity()
export class ObjResponse {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: true
    })
    priority: number

    @Column()
    event: string

    @Column()
    isLast: boolean

    @ManyToOne(() => Obj, (obj) => obj.objResponses, {
        eager: true
    })
    @JoinTable()
    obj: Obj

    @ManyToOne(() => HeatPoint, (hp) => hp.objResponses, {
        eager: true
    })
    @JoinTable()
    heatPoint: HeatPoint

    @ManyToOne(() => Response, (res) => res.objects)
    @JoinTable()
    response: Response
}