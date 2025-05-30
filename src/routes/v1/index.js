import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoutes } from "~/routes/v1/userRoutes";

const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API OK" });
});

Router.use("/users", userRoutes);

export const APIs_V1 = Router;
