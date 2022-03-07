export default function response(
  res,
  {
    status = 200,
    data,
    message = "Se ha executado la consulta satisfactoriamente",
  }
) {
  return res
    .status(status)
    .json({ status, data, message, ok: status >= 200 && status < 300 })
    .end();
}
