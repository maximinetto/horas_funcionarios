import { Contract, TypeOfOfficial } from "enums/officials";

export function typeContainsString(str: string) {
  const strToLower = str.toLowerCase();
  return Object.values(TypeOfOfficial).some((type) =>
    type.toLowerCase().includes(strToLower)
  );
}

export function stringToType(str: string | null): TypeOfOfficial | undefined {
  if (str === null) {
    return undefined;
  }
  const strToLower = str.toLowerCase();
  return Object.values(TypeOfOfficial).find(
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
