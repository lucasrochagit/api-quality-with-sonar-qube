import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserModel } from '../../business/model/user.model';
import { UserService } from '../../business/service/user.service';
import { UserDTO } from '../dto/user.dto';
import { UserDTOMapper } from '../mapper/user.dto.mapper';

@Controller('users')
export class UserController {
  constructor(
    private readonly _service: UserService,
    private readonly _mapper: UserDTOMapper,
  ) {}

  @Post()
  async create(@Body() userDTO: UserDTO): Promise<UserDTO> {
    const model: UserModel = this._mapper.deserialize(userDTO);
    const result: UserModel = await this._service.create(model);
    return this._mapper.serialize(result);
  }

  @Get()
  async find(): Promise<UserDTO[]> {
    const result: UserModel[] = await this._service.find();
    return result.map((model) => this._mapper.serialize(model));
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<UserDTO> {
    const result: UserModel = await this._service.findById(id);
    return this._mapper.serialize(result);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userDTO: UserDTO,
  ): Promise<UserDTO> {
    const model: UserModel = this._mapper.deserialize(userDTO);
    const result: UserModel = await this._service.update(id, model);
    return this._mapper.serialize(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this._service.delete(id);
  }
}
