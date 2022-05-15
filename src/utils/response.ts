import { Response } from "express";

export default function response(
  res: Response,
  {
    status = 200,
    data,
    message = "Se ha executado la consulta satisfactoriamente",
  }: {
    data: any;
    status?: number;
    message?: string;
  }
) {
  return res
    .status(status)
    .json({ status, data, message, ok: status >= 200 && status < 300 })
    .end();
}
