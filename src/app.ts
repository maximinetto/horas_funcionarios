import fastify, { FastifyReply, FastifyRequest } from "fastify";
import router from "routes";
import errorHandler from "validation/middlewares/errorHandler";
import validator from "validation/middlewares/validator";

const app = fastify();
app.register(require("@fastify/cors"));

app.setNotFoundHandler((_req: FastifyRequest, reply: FastifyReply) => {
  reply.send({
    error: "Not found",
  });
});

app.register(router, {
  prefix: "/api/v1",
});

app.setErrorHandler(errorHandler);
app.setValidatorCompiler(validator);
export default app;
