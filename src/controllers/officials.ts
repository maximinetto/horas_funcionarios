import { Request, Response } from "express";

import { logger } from "@/config";
import { asyncHandler } from "@/dependencies";
import { officialService } from "@/dependencies/container";
import response from "@/utils/response";

export const getOfficials = asyncHandler(async (_req: Request, res) => {
  const value = res.locals.value;
  const officials = await officialService.get(value);
  return response(res, {
    status: 200,
    data: officials,
    message: "Se ha executado la consulta satisfactoriamente",
  });
});

export const createOfficials = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    } = res.locals.value;
    const newOfficial = {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    };

    try {
      const official = await officialService.create(newOfficial);
      response(res, {
        status: 201,
        data: official,
        message: "Se ha creado el funcionario satisfactoriamente",
      });
    } catch (error) {
      logger.error(error);
      response(res, {
        status: 500,
        data: {
          error: "Internal server error",
        },
        message: "Ha ocurrido un error al crear el funcionario",
      });
    }
  }
);

export const updateOfficial = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = res.locals.value;

    const {
      recordNumber,
      firstName,
      lastName,
      position,
      dateOfEntry,
      chargeNumber,
      type,
      contract,
    } = res.locals.value;

    try {
      const official = await officialService.update(id, {
        recordNumber,
        firstName,
        lastName,
        position,
        dateOfEntry,
        chargeNumber,
        type,
        contract,
      });
      response(res, {
        status: 200,
        data: official,
        message: "Se ha actualizado el funcionario satisfactoriamente",
      });
    } catch (error) {
      logger.error(error);
      response(res, {
        status: 500,
        data: { error: "Internal server error" },
        message: "Ha ocurrido un error al actualizar el funcionario",
      });
    }
  }
);

export const deleteOfficial = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = res.locals.value;
    try {
      const official = await officialService.delete(id);
      response(res, {
        status: 200,
        data: official,
        message: "Se ha eliminado el funcionario satisfactoriamente",
      });
    } catch (error) {
      logger.error(error);
      response(res, {
        status: 500,
        data: { error: "Internal server error" },
        message: "Ha ocurrido un error al eliminar el funcionario",
      });
    }
  }
);
