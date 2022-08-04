export default interface Database {
  close(): Promise<void>;
}
