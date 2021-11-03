import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { FarmRepository } from '../domain/farm/farm.repository';
import { CulturePlanted } from '../common/culture-planted.enum';
import { UnprocessableEntityException } from '@nestjs/common';

const mockRepository = () => ({
  findAllByProducer: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('FarmService', () => {
  let repository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        { provide: FarmRepository, useFactory: mockRepository },
      ],
    }).compile();

    repository = await module.get<FarmRepository>(FarmRepository);
    service = await module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('createFarms', () => {
    let producer;
    let farms;

    beforeEach(() => {
      producer = {
        cpfCnpj: 33623948000152,
        name: 'Producer Mock',
        city: 'City Mock',
        state: 'SM',
      };

      farms = [
        {
          name: 'Farm Mock',
          city: 'City Mock',
          state: 'SM',
          totalArea: 1000,
          totalAreaArable: 50,
          totalAreaVegetation: 50,
          culturePlanted: [CulturePlanted.CAFE, CulturePlanted.SOJA],
        },
      ];
    });

    it('should call createFarms with farms empty', async () => {
      farms = [];
      await service.createFarms(producer, farms);
      expect(farms).toEqual(farms);
    });

    it('should call createFarms with farms not empty', async () => {
      repository.create.mockResolvedValue(farms[0]);
      await service.createFarms(producer, farms);
    });
  });

  describe('updateFarms', () => {
    let producer;
    let farms;

    beforeEach(() => {
      producer = {
        cpfCnpj: 33623948000152,
        name: 'Producer Mock',
        city: 'City Mock',
        state: 'SM',
      };

      farms = [
        {
          name: 'Farm Mock',
          city: 'City Mock',
          state: 'SM',
          totalArea: 1000,
          totalAreaArable: 50,
          totalAreaVegetation: 50,
          culturePlanted: [CulturePlanted.CAFE, CulturePlanted.SOJA],
        },
      ];
    });

    it('should call updateFarms with farms empty', async () => {
      farms = [];
      await service.updateFarms(producer, farms);
      expect(farms).toEqual(farms);
    });

    it('should call updateFarms with farms not empty', async () => {
      repository.save.mockResolvedValue(farms[0]);
      repository.findAllByProducer.mockResolvedValue(farms);
      repository.create.mockResolvedValue(farms[0]);
      repository.remove.mockResolvedValue(farms[0]);
      await service.updateFarms(producer, farms);
    });
  });

  describe('validationTotalArea', () => {
    let farms;

    beforeEach(() => {
      farms = [
        {
          name: 'Farm Mock',
          city: 'City Mock',
          state: 'SM',
          totalArea: 1000,
          totalAreaArable: 50,
          totalAreaVegetation: 50,
          culturePlanted: [CulturePlanted.CAFE, CulturePlanted.SOJA],
        },
      ];
    });

    it('should call validationTotalArea with farms empty', async () => {
      farms = [];
      await service.validationTotalArea(farms);
    });

    it('should call validationTotalArea with farms not empty', async () => {
      await service.validationTotalArea(farms);
    });

    it('must call validationTotalArea with invalid total area farm', () => {
      farms.totalArea = 20;
      expect(service.validationTotalArea(farms)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
});
