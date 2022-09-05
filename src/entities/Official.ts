import { Collection } from "@mikro-orm/core";
import Nullable from "entities/null_object/Nullable";
import { DateTime } from "luxon";
import Comparable from "utils/Comparator";

import ActualBalance from "./ActualBalance";
import Entity from "./Entity";

export enum TypeOfOfficial {
  TAS = "tas",
  TEACHER = "teacher",
}

export enum Contract {
  PERMANENT = "PERMANENT",
  TEMPORARY = "TEMPORARY",
}

export default class Official
  extends Entity
  implements Nullable, Comparable<Official>
{
  id!: number;
  recordNumber!: number;
  firstName!: string;
  lastName!: string;
  position!: string;
  contract!: Contract;
  type!: TypeOfOfficial;
  dateOfEntry!: DateTime;
  chargeNumber!: number;
  actualBalances!: Collection<ActualBalance>;

  public static DEFAULTNUMBERID = 0;

  constructor(attributes: {
    id?: number;
    recordNumber: number;
    firstName: string;
    lastName: string;
    position: string;
    contract: Contract;
    type: TypeOfOfficial;
    dateOfEntry: DateTime;
    chargeNumber: number;
    actualBalances?: ActualBalance[];
  }) {
    super();
    this.setAttributes(attributes);
  }

  private setAttributes({
    chargeNumber,
    id,
    firstName,
    lastName,
    position,
    contract,
    type,
    dateOfEntry,
    recordNumber,
    actualBalances,
    createdAt,
    updatedAt,
  }: {
    id?: number;
    recordNumber: number;
    firstName: string;
    lastName: string;
    position: string;
    contract: Contract;
    type: TypeOfOfficial;
    dateOfEntry: DateTime;
    chargeNumber: number;
    actualBalances?: ActualBalance[] | Collection<ActualBalance, unknown>;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    if (id) this.id = id;
    this.recordNumber = recordNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
    this.contract = contract;
    this.type = type;
    this.dateOfEntry = dateOfEntry;
    this.chargeNumber = chargeNumber;
    this.actualBalances =
      !Array.isArray(actualBalances) && actualBalances != null
        ? actualBalances
        : new Collection<ActualBalance>(this, actualBalances);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  entityName(): string {
    throw new Error("Method not implemented.");
  }

  public isDefault(): boolean {
    return false;
  }

  public static default(id = Official.DEFAULTNUMBERID): Official {
    return new Official({
      id,
      recordNumber: 0,
      firstName: "",
      lastName: "",
      position: "",
      contract: Contract.PERMANENT,
      type: TypeOfOfficial.TAS,
      dateOfEntry: DateTime.fromMillis(0),
      chargeNumber: 0,
    });
  }

  update(other: Official) {
    const {
      actualBalances,
      chargeNumber,
      contract,
      dateOfEntry,
      firstName,
      lastName,
      position,
      recordNumber,
      type,
      id,
      createdAt,
      updatedAt,
    } = other;
    this.setAttributes({
      actualBalances,
      chargeNumber,
      contract,
      dateOfEntry,
      firstName,
      lastName,
      position,
      recordNumber,
      type,
      id,
      createdAt,
      updatedAt,
    });
  }

  compareTo(other: Official): number {
    if (this.id === null) {
      return -1;
    }

    if (other.id === null) {
      return 1;
    }

    return this.id - other.id;
  }
}
