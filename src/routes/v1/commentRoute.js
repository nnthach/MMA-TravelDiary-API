import express from "express";
import { commentController } from "~/controllers/commentController";

const Router = express.Router();

Router.route("/").post(commentController.createComment);

Router.route("/:id")
  .get(commentController.getDetail)
  .put(commentController.updateComment)
  .delete(commentController.deleteComment);

export const commentRoutes = Router;
