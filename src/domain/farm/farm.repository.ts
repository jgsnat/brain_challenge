import { EntityRepository, Repository } from 'typeorm';
import { Farm } from './farm.entity';

@EntityRepository(Farm)
export class FarmRepository extends Repository<Farm> {
  async findAllByProducer(producer): Promise<Farm[]> {
    const query = this.createQueryBuilder('farm').leftJoinAndSelect('farm.producer', 'producer');
    query.where('producer.id = :id', { id: producer.id });
    return query.getMany();
  }
}
