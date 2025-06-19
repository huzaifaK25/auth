import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Appointment } from "../../appointments/entities/appointment.entity";



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

    // each Doctor relates to a User to the entity doctor_detail in User table
    @OneToOne(() => User, (user) => user.doctor_detail, {
        // if user record is deleted Doctor record is also deleted
        onDelete: 'CASCADE',
        // Cannot be null, every Doctor must be liked to a User
        nullable: false
    })
    // Creates foreign key column in Doctor for user_id
    @JoinColumn({ name: 'user_id'})
    user: User;

    // each doctor has many appointments 
    @OneToMany(()=> Appointment, (appointment) => appointment.doctor_detail, {
        onDelete: "CASCADE",
        nullable: false,
    })
    // creates foreign key column in Doctor for appointment_id
    @JoinColumn({name: 'appointment_id'} )
    appointment: Appointment
}