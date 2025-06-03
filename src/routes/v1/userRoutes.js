import express from "express";
import { StatusCodes } from "http-status-codes";
import { userController } from "~/controllers/userController";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "User API GET OK" });
  })
  .put(userController.updateUser)
  .delete(userController.deleteUser);

Router.route('/register').post(userValidation.registerUser, userController.registerUser)
Router.route('/login').post(userController.loginUser)
Router.route('/refresh-token').post(userController.refreshToken)

Router.route("/:id").get(userController.getUserById);

export const userRoutes = Router;
