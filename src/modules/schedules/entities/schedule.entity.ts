import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctor_id: number;

  @Column('text', { nullable: false })
  sched_day: string;

  //   // Input format: "YYYY-MM-DD"
  //   @Column({ type: 'date' })
  //   sched_date: Date;

  // Input format: "HH:MM:SS"
  @Column({ type: 'time' })
  time_from: Date;

  // Input format: "HH:MM:SS"
  @Column({ type: 'time' })
  time_to: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  deleted_at: Date | null;
}
