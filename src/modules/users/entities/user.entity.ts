import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Doctor } from "./doctor.entity";
import { Patient } from "./patient.entity";

export enum Role {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { length: 100 })
  password: string;

  @Column('enum', { enum: Role, nullable: false })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  deleted_at: Date | null;

    // Each User is associated with one Doctor entity, and that Doctor points back to this user
    @OneToOne(() => Doctor, (doctor) => doctor.user)
    doctor_detail: Doctor;
    
    // Each User is associated with one Patient entity, and that Patient points back to this user
    @OneToOne(() => Patient, (patient) => patient.user)
    patient_detail: Patient;
} 