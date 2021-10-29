import { Column, Entity, Unique } from 'typeorm';
import { EntityAbstract } from '../../common/entity.abstract';

@Entity()
@Unique(['cpfCnpj'])
export class Producer extends EntityAbstract {
  @Column({ nullable: false, type: 'int' })
  cpfCnpj: number;

  @Column({ nullable: false, type: 'varchar', length: 180 })
  name: string;

  @Column({ nullable: true, type: 'varchar', length: 150 })
  city: string;

  @Column({ nullable: true, type: 'varchar', length: 2 })
  state: string;
}
