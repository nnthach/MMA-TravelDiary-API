import express from "express";
import { StatusCodes } from "http-status-codes";
import { postRoutes } from "~/routes/v1/postRoute";
import { userRoutes } from "~/routes/v1/userRoutes";

const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API OK" });
});

Router.use("/users", userRoutes);
Router.use("/post", postRoutes);

export const APIs_V1 = Router;
