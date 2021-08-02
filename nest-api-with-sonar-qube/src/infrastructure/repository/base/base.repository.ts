import { IRepository } from '../interface/repository.interface';
import { Repository } from 'typeorm';

export class BaseRepository<Entity, IdType>
  implements IRepository<Entity, IdType>
{
  protected constructor(protected readonly _repository: Repository<Entity>) {}

  async create(item: Entity): Promise<Entity> {
    return await this._repository.save(item);
  }

  async find(): Promise<Entity[]> {
    return await this._repository.find();
  }

  async findById(id: IdType): Promise<Entity> {
    return await this._repository.findOne(id);
  }

  async update(id: IdType, item: Entity): Promise<Entity> {
    await this._repository.update(id, item);
    return this.findById(id);
  }

  async delete(id: IdType): Promise<void> {
    await this._repository.delete(id);
  }

  async checkExists(params: any): Promise<boolean> {
    const result: Entity = await this._repository.findOne(params);
    return !!result;
  }
}
