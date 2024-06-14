import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, JoinTable, ManyToMany, BeforeInsert, BeforeUpdate, Repository, OneToOne } from "typeorm"
import { Response } from "../../response/entities/response.entity"


@Entity()
export class User {

    @PrimaryGeneratedColumn(
        {
            
        }
    )
    id: number

    @Column({
        unique: true
    })
    username: string

    @Column({
        nullable: true
    }) 
    fullname: string

    @Column({   
        select: false
    })
    password: string

    @Column({
        select: false,
        nullable: true
    })
    refreshToken: string

    @OneToOne(() => Response)
    @JoinColumn()
    response: Response
}
