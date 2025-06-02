import express from "express";
import { StatusCodes } from "http-status-codes";
import { storageController } from "~/controllers/storageController";
import { storageValidation } from "~/validations/storageValidation";

const Router = express.Router();

Router.route("/")
  .get(storageController.getAllStorage)
  .post(storageValidation.addPostToStorage, storageController.addPostToStorage);

// Sửa tên export nếu đang là `storageRoute`
export const storageRoutes = Router;
