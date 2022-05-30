import crypto from "crypto";

export const generateRandomUUIDV4 = function (): string {
  return crypto.randomUUID();
};
