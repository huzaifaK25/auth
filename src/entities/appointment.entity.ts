import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Doctor } from "./doctor.entity";
import { Patient } from "./patient.entity";

export enum Status {
    CONFIRMED = 'confirmed',
    DECLINED = 'declined',
    PENDING = 'pending'
}

@Entity('appointment')
export class Appointment {

    @PrimaryGeneratedColumn()
    id: number

    // Input format: "YYYY-MM-DD"
    @Column({type: 'date'})
    appt_date: Date

    // Input format: "HH:MM:SS"
    @Column({type: 'time'})
    appt_time: Date

    @Column({enum: Status, nullable: false})
    appt_status: Status

    @Column('varchar', {length: 500})
    patient_complaint: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column('timestamp',{nullable: true})
    deleted_at: Date | null 

    @ManyToOne(() => Doctor, (doctor) => doctor.appointment) 
    doctor_detail: Doctor 
    
    @ManyToOne(() => Patient, (patient) => patient.appointment)
    patient_detail: Patient
}