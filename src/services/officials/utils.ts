import { Contract, TypeOfOfficials } from "@prisma/client";

export function typeContainsString(str: string) {
  const strToLower = str.toLowerCase();
  return Object.values(TypeOfOfficials).some((type) =>
    type.toLowerCase().includes(strToLower)
  );
}

export function stringToType(str: string | null): TypeOfOfficials | undefined {
  if (str === null) {
    return undefined;
  }
  const strToLower = str.toLowerCase();
  return Object.values(TypeOfOfficials).find(
    (type) => type.toLowerCase() === strToLower
  );
}

export function contractContainsString(str: string) {
  const strToLower = str.toLowerCase();
  return Object.values(Contract).some((contract) =>
    contract.toLowerCase().includes(strToLower)
  );
}

export function stringToContract(str: string | null) {
  if (str === null) {
    return undefined;
  }
  const strToLower = str.toLowerCase();
  return Object.values(Contract).find(
    (contract) => contract.toLowerCase() === strToLower
  );
}
