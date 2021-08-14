import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/entity/user.entity';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ServiceErrorException } from '../exception/service.error.exception';
import { UserModelMapper } from '../mapper/user.model.mapper';
import { UserModel } from '../model/user.model';
import { IUserService } from './interface/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly _repository: UserRepository,
    private readonly _mapper: UserModelMapper,
  ) {}

  async create(item: UserModel): Promise<UserModel> {
    try {
      const entity: UserEntity = this._mapper.deserialize(item);
      const result: UserEntity = await this._repository.create(entity);
      return this._mapper.serialize(result);
    } catch (err) {
      throw new ServiceErrorException('create');
    }
  }

  async find(): Promise<UserModel[]> {
    try {
      const result: UserEntity[] = await this._repository.find();
      return result.map((item: UserEntity) => this._mapper.serialize(item));
    } catch (err) {
      throw new ServiceErrorException('find');
    }
  }

  async findById(id: number): Promise<UserModel> {
    try {
      await this.checkIfExistsById(id);
      const result: UserEntity = await this._repository.findById(id);
      return this._mapper.serialize(result);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new ServiceErrorException('findById');
    }
  }

  async update(id: number, item: UserModel): Promise<UserModel> {
    try {
      await this.checkIfExistsById(id);
      const entity: UserEntity = this._mapper.deserialize(item);
      const result: UserEntity = await this._repository.update(id, entity);
      return this._mapper.serialize(result);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new ServiceErrorException('update');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this._repository.delete(id);
    } catch (err) {
      throw new ServiceErrorException('delete');
    }
  }

  private async checkIfExistsById(id: number): Promise<void> {
    const exists = await this._repository.checkExists({ id });
    if (!exists) {
      throw new NotFoundException('User not found or already removed.');
    }
  }
}
