import express from "express";
import { StatusCodes } from "http-status-codes";
import { userController } from "~/controllers/userController";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

Router.route("/").get(userController.getListUsers);

Router.route("/register").post(
  userValidation.registerUser,
  userController.registerUser
);
Router.route("/login").post(userController.loginUser);
Router.route("/refresh-token").post(userController.refreshToken);
Router.route("/forgot-password").post(userController.forgotPassword);
Router.route("/reset-password").post(userController.resetPassword);
Router.route("/resend-otp").post(userController.resendOTP);

Router.route("/:id")
  .get(userController.getUserById)
  .delete(userController.deleteUser)
  .put(userController.updateUser);

export const userRoutes = Router;
