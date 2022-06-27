import { TypeOfOfficials } from "@prisma/client";

import Calculations from "@/collections/Calculations";
import CalculationTAS from "@/entities/CalculationTAS";
import NotExistsError from "@/errors/NotExistsError";
import { operations } from "@/persistence/officials";
import calculateForTAS from "@/services/calculations/TAS";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export async function calculate({
  calculations,
  year,
  officialId,
}: {
  calculations: Calculations<CalculationTAS>;
  year: number;
  officialId: number;
}) {
  officialId = Number(officialId);
  const officialInstance = await operations.getOne(officialId);
  if (officialInstance.isEmpty()) {
    throw new NotExistsError("The official does not exists");
  }

  const official = officialInstance.get();

  if (official.type === TypeOfOfficials.TEACHER) {
    calculateForTeacher({
      officialId,
      year,
    });
  }

  return calculateForTAS({ official, calculations, year });
}

function calculateForTeacher({ officialId, year }) {
  console.log({
    officialId,
    year,
  });
}
