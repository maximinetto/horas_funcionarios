import fastify, {
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import router from "routes";
import errorHandler from "validation/middlewares/errorHandler";
import validator from "validation/middlewares/validator";

export default function buildApp(options?: FastifyServerOptions) {
  const app = fastify(options);
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
  if (process.env.NODE_ENV === "development") {
    app.log.info(app.printRoutes());
  }
  return app;
}
