import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserBlockedStatusEnum } from './enums/user-blocked-status.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true, default: null, nullable: true })
  telegram_id: number;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  last_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: null,
    nullable: true,
  })
  username: string;

  @Column({
    type: 'enum',
    enum: UserBlockedStatusEnum,
    default: UserBlockedStatusEnum.ACTIVE,
  })
  is_blocked: UserBlockedStatusEnum;
}
