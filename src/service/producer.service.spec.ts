import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerRepository } from '../domain/producer/producer.repository';
import { FarmService } from './farm.service';
import { CulturePlanted } from '../common/culture-planted.enum';

const mockRepository = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  findProducerByCpfCnpj: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockFarmService = () => ({
  createFarms: jest.fn(),
  updateFarms: jest.fn(),
  validationTotalArea: jest.fn(),
});

describe('ProducerService', () => {
  let repository;
  let service;
  let farmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        { provide: ProducerRepository, useFactory: mockRepository },
        { provide: FarmService, useFactory: mockFarmService },
      ],
    }).compile();

    repository = await module.get<ProducerRepository>(ProducerRepository);
    service = await module.get<ProducerService>(ProducerService);
    farmService = await module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(farmService).toBeDefined();
  });

  describe('findAll', () => {
    let mockQuery;

    beforeEach(() => {
      mockQuery = {
        name: '',
        cpfCnpj: '',
        limit: 1,
        page: 1,
        sort: '',
        isActive: true,
      };
    });

    it('should call the findAll method', async () => {
      repository.findAll.mockResolvedValue('resultOfSearch');
      const result = await service.findAll(mockQuery);
      expect(repository.findAll).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual('resultOfSearch');
    });

    it('should call the findAll method with not found producers', () => {
      repository.findAll.mockResolvedValue({ total: 0 });
      expect(service.findAll(mockQuery)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    let select;

    beforeEach(() => {
      select = {
        where: { id: 1 },
        relations: ['farms'],
      };
    });

    it('should call the findById method', async () => {
      repository.findOne.mockResolvedValue('result');
      const result = await service.findById(1);
      expect(repository.findOne).toHaveBeenCalledWith(select);
      expect(result).toEqual('result');
    });

    it('should call the findById method with not found producer', () => {
      expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    let mockParams;

    beforeEach(() => {
      mockParams = {
        cpfCnpj: 50053951000105,
        name: 'Producer Mock',
        city: 'City Mock',
        state: 'SM',
        farms: [
          {
            name: 'Farm Mock',
            city: 'City Mock',
            state: 'SM',
            totalArea: 1000,
            totalAreaArable: 50,
            totalAreaVegetation: 50,
            culturePlanted: [CulturePlanted.CAFE, CulturePlanted.SOJA],
          },
        ],
      };
    });

    it('should call create an user', async () => {
      repository.save.mockResolvedValue(mockParams);
      repository.create.mockResolvedValue(mockParams);
      const result = await service.create(mockParams);
      expect(result).toEqual(mockParams);
    });

    it('should call create with an producer exists', () => {
      repository.findProducerByCpfCnpj.mockResolvedValue(mockParams);
      expect(service.create(mockParams)).rejects.toThrow(ConflictException);
    });

    it('should call create an producer with farms invalid', () => {
      mockParams.totalArea = 20;
      expect(service.create(mockParams)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('updateFull', () => {
    let mockParams;

    beforeEach(() => {
      mockParams = {
        cpfCnpj: 50053951000105,
        name: 'Producer Mock',
        city: 'City Mock',
        state: 'SM',
        farms: [
          {
            name: 'Farm Mock',
            city: 'City Mock',
            state: 'SM',
            totalArea: 1000,
            totalAreaArable: 50,
            totalAreaVegetation: 50,
            culturePlanted: [CulturePlanted.CAFE, CulturePlanted.SOJA],
          },
        ],
      };
    });

    it('should call updateFull an producer', async () => {
      repository.findOne.mockResolvedValue(mockParams);
      mockParams.email = 'teste2@teste.com';
      const result = await service.updateFull(1, mockParams);
      expect(result.email).toEqual(mockParams.email);
    });

    it('should call updateFull an producer if producer not found', () => {
      expect(service.updateFull(1, mockParams)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call updateFull an producer with farms invalid', () => {
      mockParams.totalArea = 20;
      expect(service.updateFull(1, mockParams)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('updateIncremental', () => {
    let mockParams;

    beforeEach(() => {
      mockParams = {
        name: 'Producer2 Mock',
        city: 'City2 Mock',
        state: 'SM',
        farms: [
          {
            name: 'Farm Mock',
            city: 'City Mock',
            state: 'SM',
            totalArea: 1000,
            totalAreaArable: 50,
            totalAreaVegetation: 50,
            culturePlanted: [CulturePlanted.CAFE, CulturePlanted.SOJA],
          },
        ],
      };
    });

    it('should call updateIncremental an producer', async () => {
      repository.findOne.mockResolvedValue(mockParams);
      mockParams.email = 'teste2@teste.com';
      const result = await service.updateIncremental(1, mockParams);
      expect(result.email).toEqual(mockParams.email);
    });

    it('should call updateIncremental an producer if producer not found', () => {
      expect(service.updateIncremental(1, mockParams)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call updateIncremental an producer with farms invalid', () => {
      mockParams.totalArea = 20;
      expect(service.updateIncremental(1, mockParams)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('delete', () => {
    it('should call delete an producer', async () => {
      const mockUser = { isActive: true };
      repository.findOne.mockResolvedValue(mockUser);
      await service.delete(1);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should call delete an producer if producer not found', () => {
      expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
