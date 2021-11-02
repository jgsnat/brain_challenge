import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerRepository } from '../domain/producer/producer.repository';
import { Producer } from '../domain/producer/producer.entity';
import { FarmService } from './farm.service';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(ProducerRepository)
    private repository: ProducerRepository,
    private farmService: FarmService,
  ) {}

  async findAll(params): Promise<{ list: Producer[]; total: number }> {
    const result = await this.repository.findAll(params);
    if (result.total < 1) {
      throw new NotFoundException('Producers not found');
    }

    return result;
  }

  async findById(id: number): Promise<Producer> {
    const producer = await this.repository.findOne({
      where: { id },
      relations: ['farms'],
    });
    if (!producer) throw new NotFoundException('Producer not found');

    return producer;
  }

  async create(params): Promise<Producer> {
    await this.cpfCnpjExists(params.cpfCnpj);
    const { cpfCnpj, name, city, state, farms } = params;
    const producer = this.repository.create();
    producer.cpfCnpj = cpfCnpj;
    producer.name = name;
    producer.city = city;
    producer.state = state;
    producer.farms = farms;
    await this.repository.save(producer);
    await this.farmService.createFarms(producer, farms);

    return producer;
  }

  async updateFull(id: number, params): Promise<Producer> {
    const producerFound = await this.findById(id);
    const { cpfCnpj, name, city, state, farms } = params;
    producerFound.cpfCnpj = cpfCnpj;
    producerFound.name = name;
    producerFound.city = city;
    producerFound.state = state;
    await this.repository.save(producerFound);
    await this.farmService.updateFarms(producerFound, farms);
    producerFound.farms = farms;

    return producerFound;
  }

  async updateIncremental(id: number, params): Promise<Producer> {
    const producerFound = await this.findById(id);
    const { cpfCnpj, name, city, state, farms } = params;
    if (cpfCnpj) {
      producerFound.cpfCnpj = cpfCnpj;
    }

    if (name) {
      producerFound.name = name;
    }

    if (city) {
      producerFound.city = city;
    }

    if (state) {
      producerFound.state = state;
    }
    await this.repository.save(producerFound);

    if (farms) {
      if (farms.length > 0) {
        await this.farmService.updateFarms(producerFound, farms);
      } else {
        throw new UnprocessableEntityException('Passwords do not match');
      }
    }
    producerFound.farms = farms;

    return producerFound;
  }

  async delete(id: number): Promise<void> {
    const producerFound = await this.findById(id);
    producerFound.isActive = false;
    await this.repository.save(producerFound);
  }

  async cpfCnpjExists(cpfCnpj: string): Promise<void> {
    const producerFound = await this.repository.findProducerByCpfCnpj(cpfCnpj);
    if (producerFound) {
      throw new ConflictException('CpfCnpj is already in use');
    }
  }
}
