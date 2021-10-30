import { EntityRepository, Repository } from 'typeorm';
import { Farm } from './farm.entity';

@EntityRepository(Farm)
export class FarmRepository extends Repository<Farm> {}
