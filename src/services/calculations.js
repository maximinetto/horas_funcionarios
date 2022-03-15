import { TypeOfOfficials } from "@prisma/client";
import { operations } from "persistence/officials";
import calculateForTAS from "./calculations_teacher";

export async function calculate({
  calculations,
  actualDate = new Date(),
  year,
  officialId,
}) {
  if (!Array.isArray(calculations)) {
    throw new Error("Calculations must be an array");
  }

  officialId = Number(officialId);
  const official = await operations.getOne(officialId);

  if (official.type === TypeOfOfficials.TEACHER) {
    return calculateForTeacher({ official, calculations, actualDate, year });
  }

  return calculateForTAS({ official, calculations, actualDate, year });
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
