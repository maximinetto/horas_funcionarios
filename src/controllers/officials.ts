import { Contract, Official, TypeOfOfficials } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { logger } from "config";
import { officialService } from "dependencies/container";
import ModelAlreadyExistsError from "errors/ModelAlreadyExistsError";
import { FastifyReply, FastifyRequest } from "fastify";
import { OfficialWithoutId } from "types/officials";
import response from "utils/response";

export const getOfficials = async (
  req: FastifyRequest<{
    Body: {
      value: {
        type?: TypeOfOfficials;
        contract?: Contract;
        year?: number;
      };
    };
  }>,
  reply: FastifyReply
) => {
  const value = req.body.value;
  const officials = await officialService.get(value);
  return response(reply, {
    status: 200,
    data: officials,
    message: "Se ha executado la consulta satisfactoriamente",
  });
};

export const createOfficials = async (
  req: FastifyRequest<{
    Body: {
      value: OfficialWithoutId;
    };
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
  } = req.body.value;
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
    response(reply, {
      status: 500,
      data: {
        error: "Internal server error",
      },
      message: "Ha ocurrido un error al crear el funcionario",
    });
  }
};

export const updateOfficial = async (
  req: FastifyRequest<{
    Body: {
      value: Official;
    };
  }>,
  reply: FastifyReply
) => {
  console.log("hello");
  const { id, ...others } = req.body.value as Official;

  try {
    const official = await officialService.update(id, others);
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
      value: {
        id: number;
      };
    };
  }>,
  reply: FastifyReply
) => {
  const { id } = req.body.value;
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
