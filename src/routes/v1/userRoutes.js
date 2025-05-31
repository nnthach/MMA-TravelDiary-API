import express from "express";
import { StatusCodes } from "http-status-codes";
import { userController } from "~/controllers/userController";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "User API GET OK" });
  })
  .post(userValidation.createUser, userController.createUser);

Router.route("/:id").get(userController.getUserById);

export const userRoutes = Router;
