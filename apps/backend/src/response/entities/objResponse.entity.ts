import {Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { Response } from './response.entity'
import { HeatPoint, Obj } from '../../database/entities-index'
@Entity()
export class ObjResponse {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    priority: number

    @Column()
    event: string

    @Column()
    isLast: boolean

    @ManyToOne(() => Obj, (obj) => obj.objResponses)
    @JoinTable()
    obj: Obj

    @ManyToOne(() => HeatPoint, (hp) => hp.objResponses)
    @JoinTable()
    heatPoint: HeatPoint

    @ManyToOne(() => Response, (res) => res.objects)
    @JoinTable()
    response: Response
}