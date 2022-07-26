export default interface Converter<E, D> {
  fromDTOToEntity(dto: D): E;
  fromEntityToDTO(entity: E): D;
  fromEntitiesToDTOs(entities: E[]): D[];
  fromDTOsToEntities(dtos: D[]): E[];
}

export abstract class AbstractConverter<E, D> implements Converter<E, D> {
  public abstract fromDTOToEntity(dto: D): E;
  public abstract fromEntityToDTO(entity: E): D;
  public fromDTOsToEntities(models: D[]): E[] {
    return models.map(this.fromDTOToEntity);
  }
  public fromEntitiesToDTOs(entities: E[]): D[] {
    return entities.map(this.fromEntityToDTO);
  }
}
