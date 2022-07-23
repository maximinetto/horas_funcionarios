import { configureDotEnv } from "./src/config";

process.env.NODE_ENV = "test";
configureDotEnv(".env.test");
