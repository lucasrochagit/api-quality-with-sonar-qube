export interface IRepository<Entity, IdType> {
  create(item: Entity): Promise<Entity>;

  find(): Promise<Entity[]>;

  findById(id: IdType): Promise<Entity>;

  update(id: IdType, item: Entity): Promise<Entity>;

  delete(id: IdType): Promise<void>;

  checkExists(params: any): Promise<boolean>;
}
