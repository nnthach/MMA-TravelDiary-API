import express from "express";
import { storageController } from "~/controllers/storageController";
import { storageValidation } from "~/validations/storageValidation";

const Router = express.Router();

Router.route("/").post(
  storageValidation.addPostToStorage,
  storageController.addPostToStorage
);

export const storageRoute = Router;
