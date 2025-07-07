import express from "express";
import { StatusCodes } from "http-status-codes";
import { jwtMiddleware } from "~/middlewares/jwtMiddleware";
import { commentRoutes } from "~/routes/v1/commentRoute";
import { postRoutes } from "~/routes/v1/postRoute";
import { reportRoutes } from "~/routes/v1/reportRoute";
import { storageRoutes } from "~/routes/v1/storageRoute";
import { userRoutes } from "~/routes/v1/userRoutes";

const Router = express.Router();

Router.use(jwtMiddleware);

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API OK" });
});

Router.use("/users", userRoutes);
Router.use("/post", postRoutes);

Router.use("/storage", storageRoutes);
Router.use("/report", reportRoutes);
Router.use("/comments", commentRoutes);

export const APIs_V1 = Router;
