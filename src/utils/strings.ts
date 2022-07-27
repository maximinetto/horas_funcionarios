import crypto from "crypto";

export const generateRandomUUIDV4 = function (): string {
  return crypto.randomUUID();
};

export function bigIntSerializator() {
  // eslint-disable-next-line no-extend-native
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}
