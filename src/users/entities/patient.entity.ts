import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  contact_number: number;

  // foreign key column
  @Column()
  user_id: number;

  // defining relation
  @OneToOne(() => User, (user) => user.patient_detail, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
