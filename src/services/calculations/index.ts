import NotExistsError from "@/errors/NotExistsError";
import { operations } from "@/persistence/officials";
import calculateForTAS from "@/services/calculations/TAS";
import { TypeOfOfficials } from "@prisma/client";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export async function calculate({ calculations, year, officialId }) {
  if (!Array.isArray(calculations)) {
    throw new Error("Calculations must be an array");
  }

  officialId = Number(officialId);
  const officialInstance = await operations.getOne(officialId);
  if (officialInstance.isEmpty()) {
    throw new NotExistsError("The official does not exists");
  }

  const official = officialInstance.get();

  if (official.type === TypeOfOfficials.TEACHER) {
    // TODO: calculateForTeacher
  }

  return calculateForTAS({ official, calculations, year });
}

function calculateForTeacher({
  id,
  officialId,
  year,
  month,
  observations,
  discount,
  surplus,
}) {}
