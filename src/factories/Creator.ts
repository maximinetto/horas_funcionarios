export default interface Creator<T, U> {
  create(type: U): T;
}
