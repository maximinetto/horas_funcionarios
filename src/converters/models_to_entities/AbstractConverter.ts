export default interface Converter<M, E> {
  fromModelToEntity(model: M): E;
  fromEntityToModel(entity: E): M;
}

export abstract class AbstractConverter<M, E> implements Converter<M, E> {
  public abstract fromModelToEntity(model: M): E;
  public abstract fromEntityToModel(entity: E): M;
  public fromModelsToEntities(models: M[]): E[] {
    return models.map((m) => this.fromModelToEntity(m));
  }
  public fromEntitiesToModels(entities: E[]): M[] {
    return entities.map((e) => this.fromEntityToModel(e));
  }
}
