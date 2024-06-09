import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, JoinTable, ManyToMany, BeforeInsert, BeforeUpdate, Repository } from "typeorm"


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
}
