import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { EntityAbstract } from '../../common/entity.abstract';
import { Farm } from '../farm/farm.entity';

@Entity()
@Unique(['cpfCnpj'])
export class Producer extends EntityAbstract {
  @Column({ nullable: false, type: 'varchar', length: 14 })
  cpfCnpj: string;

  @Column({ nullable: false, type: 'varchar', length: 180 })
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 150 })
  city: string;

  @Column({ nullable: true, type: 'varchar', length: 2 })
  state: string;

  @OneToMany(() => Farm, farm => farm.producer)
  farms: Farm[];
}
