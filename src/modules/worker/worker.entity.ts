import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('workers')
export class Worker {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User | null;

    @Column({ type: 'varchar', length: 255 })
    os_type: string;

    @Column({ type: 'varchar', length: 255 })
    os_name: string;

    @Column({ type: 'varchar', length: 255 })
    os_version: string;

    @Column({ type: 'varchar', length: 255 })
    arch: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    worker_key: string;

    @Column({ type: 'boolean', default: false })
    is_online: boolean;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    created_at: Date;
}