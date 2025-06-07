import express from "express";
import { storageController } from "~/controllers/storageController";
import { storageValidation } from "~/validations/storageValidation";

const Router = express.Router();

Router.route("/:id")
  .get(storageController.getStorageOfUser)
  .patch(
    storageValidation.addPostToStorage,
    storageController.addPostToStorage
  );

export const storageRoutes = Router;
