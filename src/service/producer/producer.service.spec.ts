import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { ProducerRepository } from '../../domain/producer/producer.repository';
import { Column } from 'typeorm';
import exp from 'constants';

const mockProducerRepository = () => ({
  findProducers: jest.fn(),
  findProducerByCpfCnpj: jest.fn(),
});

describe('ProducerService', () => {
  let repository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        { provide: ProducerRepository, useFactory: mockProducerRepository },
      ],
    }).compile();

    repository = await module.get<ProducerRepository>(ProducerRepository);
    service = await module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findProducers', () => {
    it('should call the findProducers method of the ProducerRepository', async ()=> {
      repository.findProducers.mockRejectedValue('resultOfSearch');
      const mockFindProducers = {
        status: true,
        page: 1,
        limit: 50,
        cpfCnpj: null,
        name: '',
        city: '',
        state: '',
        sort: '',
      };
      const result = await service.findProducers(mockFindProducers);
      expect(repository.findProducers).toHaveBeenCalledWith(mockFindProducers);
      expect(result).toEqual('resultOfSearch');
    });
  });
});
