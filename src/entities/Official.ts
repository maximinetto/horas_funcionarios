import { Contract, TypeOfOfficials } from "@prisma/client";
import Nullable from "entities/null_object/Nullable";
import { DateTime } from "luxon";
import { OfficialSimple } from "types/officials";
import Comparable from "utils/Comparator";

import { AbstractEntity } from "./AbstractEntity";
import type ActualBalance from "./ActualBalance";
import Entity from "./Entity";

export default class Official
  extends AbstractEntity
  implements Entity, Nullable, Comparable<Official>, OfficialSimple
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
  private _actualBalances: ActualBalance[];

  public static DEFAULTNUMBERID = 0;

  public constructor(
    id: number,
    recordNumber: number,
    firstName: string,
    lastName: string,
    position: string,
    contract: Contract,
    type: TypeOfOfficials,
    dateOfEntry: DateTime,
    chargeNumber: number,
    actualBalances?: ActualBalance[]
  ) {
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
    this._actualBalances = actualBalances ?? [];
  }
  entityName(): string {
    throw new Error("Method not implemented.");
  }

  public get id(): number {
    return this._id;
  }

  public get recordNumber(): number {
    return this._recordNumber;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public get position(): string {
    return this._position;
  }

  public get contract(): Contract {
    return this._contract;
  }

  public get type(): TypeOfOfficials {
    return this._type;
  }

  public get dateOfEntry(): DateTime {
    return this._dateOfEntry;
  }

  public get chargeNumber(): number {
    return this._chargeNumber;
  }

  public get actualBalances(): ActualBalance[] {
    return this._actualBalances;
  }

  public isDefault(): boolean {
    return false;
  }

  public static default(id = Official.DEFAULTNUMBERID): Official {
    return new Official(
      id,
      0,
      "",
      "",
      "",
      Contract.PERMANENT,
      TypeOfOfficials.NOT_TEACHER,
      DateTime.fromMillis(0),
      0,
      []
    );
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
