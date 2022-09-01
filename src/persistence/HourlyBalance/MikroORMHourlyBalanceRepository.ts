import HourlyBalance from "entities/HourlyBalance";
import HourlyBalanceTAS from "entities/HourlyBalanceTAS";
import HourlyBalanceTeacher from "entities/HourlyBalanceTeacher";
import UnexpectedValueError from "errors/UnexpectedValueError";
import { Optional } from "typescript-optional";

import HourlyBalanceRepository from "./HourlyBalanceRepository";
import HourlyBalanceTASRepository from "./HourlyBalanceTASRepository";
import HourlyBalanceTeacherRepository from "./HourlyBalanceTeacherRepository";

export default class MikroORMHourlyBalanceRepository
  implements HourlyBalanceRepository
{
  private _hourlyBalanceTASRepository: HourlyBalanceTASRepository;
  private _hourlyBalanceTeacherRepository: HourlyBalanceTeacherRepository;

  constructor({
    hourlyBalanceTASRepository,
    hourlyBalanceTeacherRepository,
  }: {
    hourlyBalanceTASRepository: HourlyBalanceTASRepository;
    hourlyBalanceTeacherRepository: HourlyBalanceTeacherRepository;
  }) {
    this._hourlyBalanceTASRepository = hourlyBalanceTASRepository;
    this._hourlyBalanceTeacherRepository = hourlyBalanceTeacherRepository;
  }

  async filter(predicate: Object): Promise<HourlyBalance[]> {
    const hourlyBalanceTAS = await this._hourlyBalanceTASRepository.filter(
      predicate
    );
    const hourlyBalanceTeacher =
      await this._hourlyBalanceTeacherRepository.filter(predicate);

    return [...hourlyBalanceTAS, ...hourlyBalanceTeacher];
  }

  async get(id: string): Promise<Optional<HourlyBalance>> {
    const hourlyBalanceTAS = await this._hourlyBalanceTASRepository.get(id);
    const hourlyBalanceTeacher = await this._hourlyBalanceTeacherRepository.get(
      id
    );

    if (hourlyBalanceTAS.isPresent()) return hourlyBalanceTAS;
    if (hourlyBalanceTeacher.isPresent()) return hourlyBalanceTeacher;

    return Optional.empty();
  }

  async getAll(): Promise<HourlyBalance[]> {
    const hourlyBalanceTAS = await this._hourlyBalanceTASRepository.getAll();
    const hourlyBalanceTeacher =
      await this._hourlyBalanceTeacherRepository.getAll();

    return [...hourlyBalanceTAS, ...hourlyBalanceTeacher];
  }

  add(entity: HourlyBalance): Promise<HourlyBalance> {
    if (entity instanceof HourlyBalanceTAS)
      return this._hourlyBalanceTASRepository.add(entity);
    if (entity instanceof HourlyBalanceTeacher)
      return this._hourlyBalanceTeacherRepository.add(entity);

    throw new UnexpectedValueError(
      "Entity is not a subtype valid of HourlyBalance"
    );
  }

  async addRange(entities: HourlyBalance[]): Promise<HourlyBalance[]> {
    const tasEntities = entities.filter(
      (e) => e instanceof HourlyBalanceTAS
    ) as HourlyBalanceTAS[];
    const teacherEntities = entities.filter(
      (e) => e instanceof HourlyBalanceTeacher
    ) as HourlyBalanceTeacher[];

    const tasResult = await this._hourlyBalanceTASRepository.addRange(
      tasEntities
    );
    const teacherResult = await this._hourlyBalanceTeacherRepository.addRange(
      teacherEntities
    );

    return [...tasResult, ...teacherResult];
  }

  set(entity: HourlyBalance): Promise<HourlyBalance> {
    if (entity instanceof HourlyBalanceTAS)
      return this._hourlyBalanceTASRepository.set(entity);
    if (entity instanceof HourlyBalanceTeacher)
      return this._hourlyBalanceTeacherRepository.set(entity);

    throw new UnexpectedValueError(
      "Entity is not a subtype valid of HourlyBalance"
    );
  }

  setRange(data: HourlyBalance, keys: string[]): Promise<HourlyBalance[]> {
    if (data instanceof HourlyBalanceTAS)
      return this._hourlyBalanceTASRepository.setRange(data, keys);
    if (data instanceof HourlyBalanceTeacher)
      return this._hourlyBalanceTeacherRepository.setRange(data, keys);

    throw new UnexpectedValueError(
      "Entity is not a subtype valid of HourlyBalance"
    );
  }

  remove(entity: HourlyBalance): Promise<HourlyBalance> {
    if (entity instanceof HourlyBalanceTAS)
      return this._hourlyBalanceTASRepository.remove(entity);
    if (entity instanceof HourlyBalanceTeacher)
      return this._hourlyBalanceTeacherRepository.remove(entity);

    throw new UnexpectedValueError(
      "Entity is not a subtype valid of HourlyBalance"
    );
  }

  async removeRange(entities: HourlyBalance[]): Promise<HourlyBalance[]> {
    const tasEntities = entities.filter(
      (e) => e instanceof HourlyBalanceTAS
    ) as HourlyBalanceTAS[];
    const teacherEntities = entities.filter(
      (e) => e instanceof HourlyBalanceTeacher
    ) as HourlyBalanceTeacher[];

    const tasResult = await this._hourlyBalanceTASRepository.removeRange(
      tasEntities
    );
    const teacherResult =
      await this._hourlyBalanceTeacherRepository.removeRange(teacherEntities);

    return [...tasResult, ...teacherResult];
  }

  clear(): Promise<void> {
    return Promise.all([
      this._hourlyBalanceTASRepository.clear(),
      this._hourlyBalanceTeacherRepository.clear(),
    ]).then(() => Promise.resolve());
  }
}
