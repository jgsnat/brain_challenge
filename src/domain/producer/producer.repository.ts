import { EntityRepository, Repository } from 'typeorm';
import { Producer } from './producer.entity';
import { clearQueryParams } from '../../common/base-query-parameters.dto';

@EntityRepository(Producer)
export class ProducerRepository extends Repository<Producer> {
  async findProducers(queryParams): Promise<{ list: Producer[]; total: number }> {
    clearQueryParams(queryParams);
    const { cpfCnpj, name, city, state, isActive } = queryParams;
    const query = this.createQueryBuilder('producer');
    query.where('producer.isActive = :isActive', { isActive });

    if (cpfCnpj) {
      query.andWhere('producer.cpfCnpj = :cpfCnpj', { cpfCnpj });
    }

    if (name && name != '') {
      query.andWhere('producer.name ILIKE :name', { name: `%${name}%` });
    }

    if (city && city != '') {
      query.andWhere('producer.city ILIKE :city', { city: `%${city}%` });
    }

    if (state && state != '') {
      query.andWhere('producer.state ILIKE :state', { state: `%${state}%` });
    }
    query.skip((queryParams.page - 1) * queryParams.limit);
    query.take(+queryParams.limit);
    query.orderBy(queryParams.sort ? JSON.parse(queryParams.sort) : undefined);
    const [producers, total] = await query.getManyAndCount();

    return { list: producers, total };
  }

  async findProducerByCpfCnpj(cpfCnpj: number): Promise<Producer> {
    const query = this.createQueryBuilder('producer');
    query.where('producer.cpfCnpj = :cpfCnpj', { cpfCnpj });
    return query.getOne();
  }
}
