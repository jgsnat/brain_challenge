import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FarmRepository } from '../domain/farm/farm.repository';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(FarmRepository)
    private repository: FarmRepository,
  ) {}

  async createFarms(producer, farms): Promise<void> {
    if (farms.length > 0) {
      for (const params of farms) {
        await this.create(producer, params);
      }
    }
  }

  async updateFarms(producer, farms): Promise<void> {
    if (farms.length > 0) {
      await this.removeAllFarms(producer);
      await this.createFarms(producer, farms);
    }
  }

  private async create(producer, params): Promise<void> {
    const farm = this.repository.create();
    const {
      name,
      city,
      state,
      totalArea,
      totalAreaArable,
      totalAreaVegetation,
      culturePlanted,
    } = params;
    farm.name = name;
    farm.city = city;
    farm.state = state;
    farm.totalArea = totalArea;
    farm.totalAreaArable = totalAreaArable;
    farm.totalAreaVegetation = totalAreaVegetation;
    farm.culturePlanted = culturePlanted;
    farm.producer = producer;
    await this.repository.save(farm);
  }

  private async removeAllFarms(producer): Promise<void> {
    const farms = await this.repository.findAllByProducer(producer);
    for (const farm of farms) {
      await this.repository.remove(farm);
    }
  }

  public async validationTotalArea(farms): Promise<void> {
    if (farms.length > 0) {
      for (const farm of farms) {
        const { totalArea, totalAreaArable, totalAreaVegetation } = farm;
        const availableArea = totalAreaArable + totalAreaVegetation;
        if (availableArea > totalArea) {
          throw new UnprocessableEntityException(
            'The sum of arable area and vegetation should not be greater than the total area of the farm',
          );
        }
      }
    }
  }
}
