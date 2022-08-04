import { Collection, EntitySchema } from "@mikro-orm/core";
import { Contract, TypeOfOfficials } from "@prisma/client";
import Nullable from "entities/null_object/Nullable";
import { DateTime } from "luxon";
import Comparable from "utils/Comparator";

import ActualBalance from "./ActualBalance";
import Entity from "./Entity";

export default class Official
  extends Entity
  implements Nullable, Comparable<Official>
{
  private _id: number;
  private _recordNumber: number;
  private _firstName: string;
  private _lastName: string;
  private _position: string;
  private _contract: Contract;
  private _type: TypeOfOfficials;
  private _dateOfEntry: DateTime;
  private _chargeNumber: number;
  private _actualBalances: Collection<ActualBalance>;

  public static DEFAULTNUMBERID = 0;

  public constructor({
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
  }: {
    id: number;
    recordNumber: number;
    firstName: string;
    lastName: string;
    position: string;
    contract: Contract;
    type: TypeOfOfficials;
    dateOfEntry: DateTime;
    chargeNumber: number;
    actualBalances?: ActualBalance[];
  }) {
    super();
    this._id = id;
    this._recordNumber = recordNumber;
    this._firstName = firstName;
    this._lastName = lastName;
    this._position = position;
    this._contract = contract;
    this._type = type;
    this._dateOfEntry = dateOfEntry;
    this._chargeNumber = chargeNumber;
    this._actualBalances = new Collection<ActualBalance>(
      this,
      actualBalances ?? []
    );
  }
  entityName(): string {
    throw new Error("Method not implemented.");
  }

  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get recordNumber(): number {
    return this._recordNumber;
  }

  public set recordNumber(value: number) {
    this._recordNumber = value;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get position(): string {
    return this._position;
  }

  public set position(value: string) {
    this._position = value;
  }

  public get contract(): Contract {
    return this._contract;
  }

  public set contract(value: Contract) {
    this._contract = value;
  }

  public get type(): TypeOfOfficials {
    return this._type;
  }

  public set type(value: TypeOfOfficials) {
    this._type = value;
  }

  public get dateOfEntry(): DateTime {
    return this._dateOfEntry;
  }

  public set dateOfEntry(value: DateTime) {
    this._dateOfEntry = value;
  }

  public get chargeNumber(): number {
    return this._chargeNumber;
  }

  public set chargeNumber(value: number) {
    this._chargeNumber = value;
  }

  public get actualBalances(): Collection<ActualBalance, unknown> {
    return this._actualBalances;
  }

  public set actualBalances(value: Collection<ActualBalance, unknown>) {
    this._actualBalances = value;
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
      type: TypeOfOfficials.NOT_TEACHER,
      dateOfEntry: DateTime.fromMillis(0),
      chargeNumber: 0,
      actualBalances: [],
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

export const schema = new EntitySchema<Official, Entity>({
  name: "ActualBalance",
  tableName: "actual_balances",
  extends: "Entity",
  properties: {
    id: {
      type: "number",
      primary: true,
      autoincrement: true,
    },
    recordNumber: {
      type: "number",
      fieldName: "record_number",
    },
    firstName: {
      type: "string",
      fieldName: "first_name",
    },
    lastName: {
      type: "string",
      fieldName: "last_name",
    },
    position: {
      type: "string",
    },
    contract: {
      type: "string",
    },
    type: {
      type: "string",
    },
    dateOfEntry: {
      type: "dateTime",
    },
    chargeNumber: {
      type: "number",
      fieldName: "charge_number",
    },
    actualBalances: {
      reference: "1:m",
      entity: () => ActualBalance,
      mappedBy: (actualBalance) => actualBalance.official,
    },
  },
});
