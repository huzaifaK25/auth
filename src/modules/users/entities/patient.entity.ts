import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  // unique: false for dev only
  @Column({ unique: false })
  contact_number: number;

  @Column()
  user_id: number;

  // each Patient relates to a User to the entity patient_detail in User table
  @OneToOne(() => User, (user) => user.patient_detail, {
    // if user record is deleted Patient record is also deleted
    onDelete: 'CASCADE',
    // Cannot be null, every Patient must be liked to a User
    nullable: false,
  })
  // Creates foreign key column in Patient for user_id
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.patient_detail, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
