import express from "express";
import { StatusCodes } from "http-status-codes";
import { userController } from "~/controllers/userController";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

Router.route("/")
  .get(userController.getListUsers)
  .post(userController.createUser)  


Router.route("/register").post(userValidation.registerUser, userController.registerUser);
Router.route("/login").post(userController.loginUser);

Router.route("/:id")
  .get(userController.getUserById)
  .delete(userController.deleteUser)
  .put(userController.updateUser);  

Router.route('/register').post(userValidation.registerUser, userController.registerUser)
Router.route('/login').post(userController.loginUser)
Router.route('/refresh-token').post(userController.refreshToken)



export const userRoutes = Router;
