export default interface Converter<M, E, D> {
  fromModelToEntity(model: M): E;
  fromEntityToModel(entity: E): M;
  fromDTOToEntity(dto: D): E;
  fromEntityToDTO(entity: E): D;
}

// This is a bad abstraction. It's not a good idea to have a converter that converts from a model or a DTO to a Entity and viceversa.
// It's better to have a another converter that converts from a DTO to a entity and viceversa.
// Same for children.
export abstract class AbstractConverter<M, E, D> implements Converter<M, E, D> {
  public abstract fromModelToEntity(model: M): E;
  public abstract fromEntityToModel(entity: E): M;
  public fromModelsToEntities(models: M[]): E[] {
    return models.map(this.fromModelToEntity);
  }
  public fromEntitiesToModels(entities: E[]): M[] {
    return entities.map(this.fromEntityToModel);
  }
  public fromDTOToEntity(dto: D): E {
    throw new Error("Method not implemented." + dto);
  }
  public fromEntityToDTO(entity: E): D {
    throw new Error("Method not implemented." + entity);
  }

  public fromDTOsToEntities(models: D[]): E[] {
    return models.map(this.fromDTOToEntity);
  }
  public fromEntitiesToDTOs(entities: E[]): D[] {
    return entities.map(this.fromEntityToDTO);
  }
}
