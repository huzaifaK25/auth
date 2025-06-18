import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('doctor')
export class Doctor {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    specialization: string 

    @Column('int', { name: 'years_of_exp'})
    yearsOfExp: number
    
    @Column({nullable: true})
    rating: number

    @Column({nullable: true})
    introduction: string

    @Column()
    user_id: number;

    @OneToOne(() => User, (user) => user.doctor_detail, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn({ name: 'user_id'})
    user: User;
}