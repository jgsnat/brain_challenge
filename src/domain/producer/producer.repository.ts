import { EntityRepository, Repository } from 'typeorm';
import { Producer } from './producer.entity';

@EntityRepository(Producer)
export class ProducerRepository extends Repository<Producer> {
  async findProducers(queryParams): Promise<{ list: Producer[]; total: number }> {
    queryParams.status = queryParams.status === undefined ? true : queryParams.status;
    queryParams.page = queryParams.page < 1 || queryParams.page === undefined ? 1 : queryParams.page;
    queryParams.limit = queryParams.limit > 100 || queryParams.limit === undefined ? 100 : queryParams.limit;

    const { cpfCnpj, name, city, state, status } = queryParams;
    const query = this.createQueryBuilder('producer');
    query.where('producer.isActive = :status', { status });

    if (cpfCnpj) {
      query.andWhere('producer.cpfCnpj = :cpfCnpj', { cpfCnpj });
    }

    if (name) {
      query.andWhere('producer.name ILIKE :name', { name: `%${name}%` });
    }

    if (city) {
      query.andWhere('producer.city ILIKE :city', { city: `%${city}%` });
    }

    if (state) {
      query.andWhere('producer.state ILIKE :state', { state: `%${state}%` });
    }
    query.skip((queryParams.page - 1) * queryParams.limit);
    query.take(+queryParams.limit);
    query.orderBy(queryParams.sort ? JSON.parse(queryParams.sort) : undefined);
    const [producers, total] = await query.getManyAndCount();

    return { list: producers, total };
  }

  async findProducer(id: number): Promise<Producer> {
    return this.findOne(id);
  }

  async createProducer(params): Promise<Producer> {
    const { cpfCnpj, name, city, state } = params;
    const producer = this.create();
    producer.cpfCnpj = cpfCnpj;
    producer.name = name;
    producer.city = city;
    producer.state = state;
    await producer.save();

    return producer;
  }

  async updateFullProducer(id: number, params): Promise<Producer> {
    const { cpfCnpj, name, city, state } = params;
    const producer = await this.findProducer(id);
    producer.cpfCnpj = cpfCnpj;
    producer.name = name;
    producer.city = city;
    producer.state = state;
    await producer.save();

    return producer;
  }

  async incrementalUpdateProducer(id: number, params): Promise<Producer> {
    const { cpfCnpj, name, city, state } = params;
    const producer = await this.findProducer(id);

    if (cpfCnpj !== undefined) {
      producer.cpfCnpj = cpfCnpj;
    }

    if (name !== undefined || name !== '') {
      producer.name = name;
    }

    if (city !== undefined || city !== '') {
      producer.city = city;
    }

    if (state !== undefined || state !== '') {
      producer.state = state;
    }
    await producer.save();

    return producer;
  }

  async deleteProducer(id: number): Promise<void> {
    const producer = await this.findProducer(id);
    producer.isActive = false;
    await producer.save();
  }
}
