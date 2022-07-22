import { asClass, asValue, createContainer } from "awilix";

import OfficialRepository from "@/persistence/officials";
import prisma from "@/persistence/persistence.config";
import Calculator from "@/services/calculations";
import OfficialService from "@/services/officials";

const container = createContainer();

container.register({
  officialRepository: asClass(OfficialRepository),
  officialService: asClass(OfficialService),
  database: asValue(prisma),
  calculator: asClass(Calculator),
});

export const officialService = container.resolve(
  "officialService"
) as OfficialService;
export const calculator = container.resolve("calculator") as Calculator;
