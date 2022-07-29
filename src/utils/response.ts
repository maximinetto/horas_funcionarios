import { FastifyReply } from "fastify";

export default function response<T>(
  res: FastifyReply,
  {
    status = 200,
    data,
    message = "Se ha executado la consulta satisfactoriamente",
  }: {
    data: T;
    status?: number;
    message?: string;
  }
) {
  return res
    .status(status)
    .send({ status, data, message, ok: status >= 200 && status < 300 });
}
