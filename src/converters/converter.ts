export default interface Converter<M, E> {
  fromModelToEntity(model: M): E;
  fromEntityToModel(entity: E): M;
}
