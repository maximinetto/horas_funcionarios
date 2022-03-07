import express from "express";
import * as asyncHandlerExpress from "express-async-handler";

// eslint-disable-next-line new-cap
export const router = express.Router();
export const app = express();
export const asyncHandler = asyncHandlerExpress;
