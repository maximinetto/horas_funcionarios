import Nullable from "@/entities/null_object/Nullable";
import Comparable from "@/utils/Comparator";
import { Contract, TypeOfOfficials } from "@prisma/client";
import { DateTime } from "luxon";
import type ActualBalance from "./ActualBalance";

export default class Official implements Nullable, Comparable<Official> {
  private id: number;
  private recordNumber: number;
  private firstName: string;
  private lastName: string;
  private position: string;
  private contract: Contract;
  private type: TypeOfOfficials;
  private dateOfEntry: DateTime;
  private chargeNumber: number;
  private actualBalances: ActualBalance[];

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
    this.id = id;
    this.recordNumber = recordNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
    this.contract = contract;
    this.type = type;
    this.dateOfEntry = dateOfEntry;
    this.chargeNumber = chargeNumber;
    this.actualBalances = actualBalances ?? [];
  }

  public getId(): number {
    return this.id;
  }

  public getRecordNumber(): number {
    return this.recordNumber;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getPosition(): string {
    return this.position;
  }

  public getContract(): Contract {
    return this.contract;
  }

  public getType(): TypeOfOfficials {
    return this.type;
  }

  public getDateOfEntry(): DateTime {
    return this.dateOfEntry;
  }

  public getChargeNumber(): number {
    return this.chargeNumber;
  }

  public getActualBalances(): ActualBalance[] {
    return this.actualBalances;
  }

  public isDefault(): boolean {
    return false;
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
