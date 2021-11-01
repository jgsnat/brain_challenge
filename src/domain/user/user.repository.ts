import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { clearQueryParams } from '../../common/base-query-parameters.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUsers(queryParams): Promise<{ list: User[]; total: number }> {
    clearQueryParams(queryParams);
    const { email, name, isActive, role } = queryParams;
    const query = this.createQueryBuilder('user');
    query.where('user.isActive = :isActive', { isActive });

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (name) {
      query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    query.skip((queryParams.page - 1) * queryParams.limit);
    query.take(+queryParams.limit);
    query.orderBy(queryParams.sort ? JSON.parse(queryParams.sort) : undefined);
    query.select(['user.id', 'user.name', 'user.email', 'user.role', 'user.isActive']);
    const [users, total] = await query.getManyAndCount();

    return { list: users, total };
  }

  async findUserByEmail(email: string): Promise<User> {
    const query = this.createQueryBuilder('user');
    query.where('user.email = :email', { email });
    return query.getOne();
  }
}
