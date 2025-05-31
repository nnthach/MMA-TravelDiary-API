import express from "express";
import { StatusCodes } from "http-status-codes";
import { postRoutes } from "~/routes/v1/postRoute";
import { storageRoute } from "~/routes/v1/storageRoute";
import { userRoutes } from "~/routes/v1/userRoutes";

const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API OK" });
});

Router.use("/users", userRoutes);
Router.use("/post", postRoutes);
Router.use("/storage", storageRoute);

export const APIs_V1 = Router;
