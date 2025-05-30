import express from "express";
import { StatusCodes } from "http-status-codes";

const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "User API GET OK" });
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: "User API POST OK" });
  });

export const userRoutes = Router;
