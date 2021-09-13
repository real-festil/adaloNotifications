import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  date: string;

  @Column()
  appId: string;

  @Column()
  email: string;

  @Column()
  bodyText: string;

  @Column()
  titleText: string;

  @Column()
  token: string;
}
