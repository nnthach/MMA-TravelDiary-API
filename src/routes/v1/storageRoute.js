import express from "express";
import { storageController } from "~/controllers/storageController";
import { storageValidation } from "~/validations/storageValidation";

const Router = express.Router();

Router.route("/:userId")
  .get(storageController.getStorageOfUser)
  .patch(
    storageValidation.addPostToStorage,
    storageController.addPostToStorage
  );

Router.route("/:userId/:postId").delete(storageController.removePostInStorage);

export const storageRoutes = Router;
