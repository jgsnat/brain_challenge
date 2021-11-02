import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityAbstract } from '../../common/entity.abstract';
import { Producer } from '../producer/producer.entity';
import { CulturePlanted } from '../../common/culture-planted.enum';

@Entity()
export class Farm extends EntityAbstract {
  @Column({ nullable: false, type: 'varchar', length: 180 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 150 })
  city: string;

  @Column({ nullable: false, type: 'varchar', length: 2 })
  state: string;

  @Column({ nullable: false, type: 'float' })
  totalArea: number;

  @Column({ nullable: false, type: 'float' })
  totalAreaArable: number;

  @Column({ nullable: false, type: 'float' })
  totalAreaVegetation: number;

  @Column({
    nullable: false,
    type: 'varchar',
    array: true,
    enum: CulturePlanted,
  })
  culturePlanted: CulturePlanted[];

  @ManyToOne(() => Producer, (producer) => producer.farms)
  producer: Producer;
}
