import { Contract, Official, TypeOfOfficials } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { logger } from "config";
import { officialConverter, officialService } from "dependencies/container";
import ModelAlreadyExistsError from "errors/ModelAlreadyExistsError";
import { FastifyReply, FastifyRequest } from "fastify";
import { OfficialWithoutId } from "types/officials";
import response from "utils/response";

export const getOfficials = async (
  req: FastifyRequest<{
    Body: {
      type?: TypeOfOfficials;
      contract?: Contract;
      year?: number;
    };
  }>,
  reply: FastifyReply
) => {
  const value = req.body;
  const officials = await officialService.get(value);
  return response(reply, {
    status: 200,
    data: officials,
    message: "Se ha executado la consulta satisfactoriamente",
  });
};

export const createOfficials = async (
  req: FastifyRequest<{
    Body: OfficialWithoutId;
  }>,
  reply: FastifyReply
) => {
  const {
    recordNumber,
    firstName,
    lastName,
    position,
    dateOfEntry,
    chargeNumber,
    type,
    contract,
  } = req.body;
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
    const officialEntity = officialConverter.fromModelToEntity(newOfficial);
    const official = await officialService.create(officialEntity);
    response(reply, {
      status: 201,
      data: official,
      message: "Se ha creado el funcionario satisfactoriamente",
    });
  } catch (error) {
    // TODO: Implementar una excepcion personalizada
    logger.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ModelAlreadyExistsError(
        "Official already exists in the system",
        `The user with record number ${recordNumber} already exists in the system`
      );
    }
    throw error;
  }
};

export const updateOfficial = async (
  req: FastifyRequest<{
    Body: Official;
  }>,
  reply: FastifyReply
) => {
  try {
    const officialEntity = officialConverter.fromModelToEntity(req.body);
    const official = await officialService.update(officialEntity);
    response(reply, {
      status: 200,
      data: official,
      message: "Se ha actualizado el funcionario satisfactoriamente",
    });
  } catch (error) {
    // TODO: Implementar una excepcion personalizada
    logger.error(error);
    response(reply, {
      status: 500,
      data: { error: "Internal server error" },
      message: "Ha ocurrido un error al actualizar el funcionario",
    });
  }
};

export const deleteOfficial = async (
  req: FastifyRequest<{
    Body: {
      id: number;
    };
  }>,
  reply: FastifyReply
) => {
  const { id } = req.body;
  try {
    const official = await officialService.delete(id);
    response(reply, {
      status: 200,
      data: official,
      message: "Se ha eliminado el funcionario satisfactoriamente",
    });
  } catch (error) {
    // TODO: Implementar una excepcion personalizada
    logger.error(error);
    response(reply, {
      status: 500,
      data: { error: "Internal server error" },
      message: "Ha ocurrido un error al eliminar el funcionario",
    });
  }
};
