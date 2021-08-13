import { IRepository } from '../interface/repository.interface';
import { FindConditions, Repository } from 'typeorm';

export class BaseRepository<Entity, IdType>
  implements IRepository<Entity, IdType>
{
  protected constructor(readonly _repository: Repository<Entity>) {}

  async create(item: Entity): Promise<Entity> {
    return this._repository.save(item);
  }

  async find(): Promise<Entity[]> {
    return this._repository.find();
  }

  async findById(id: IdType): Promise<Entity> {
    return this._repository.findOne(id);
  }

  async update(id: IdType, item: Entity): Promise<Entity> {
    return this._repository.save({ id, ...item });
  }

  async delete(id: IdType): Promise<void> {
    await this._repository.delete(id);
  }

  async checkExists(params: FindConditions<Entity>): Promise<boolean> {
    const result: Entity = await this._repository.findOne(params);
    return !!result;
  }
}
