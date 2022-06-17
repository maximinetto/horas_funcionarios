import { Response } from "express";

export default function response<T>(
  res: Response,
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
    .json({ status, data, message, ok: status >= 200 && status < 300 })
    .end();
}
