import NotExistsError from "@/errors/NotExistsError";
import { TypeOfOfficials } from "@prisma/client";
import { operations } from "persistence/officials";
import calculateForTAS from "services/calculations/TAS";

// TODO si el año ya está calculado y existen posteriores lo mejor es mandarlo a una cola
export async function calculate({ calculations, year, officialId }) {
  if (!Array.isArray(calculations)) {
    throw new Error("Calculations must be an array");
  }

  officialId = Number(officialId);
  const official = await operations.getOne(officialId);
  if (!official) {
    throw new NotExistsError("The official does not exists");
  }

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
