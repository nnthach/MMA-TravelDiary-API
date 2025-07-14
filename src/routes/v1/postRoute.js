import express from "express";
import { StatusCodes } from "http-status-codes";
import { postController } from "~/controllers/postController";
import { userController } from "~/controllers/userController";
import { postValidation } from "~/validations/postValidation";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

Router.route("/")
  .get(postController.getAllPost)
  .post(postValidation.createPost, postController.createPost);
  
Router.get("/search", postController.searchPosts);
Router.get("/random", postController.getRandomPosts);
 
Router.route("/:id")
  .get(postController.findPostById)
  .delete(postController.deletePost)
  .put(postController.updatePost);

Router.route("/user/:id").get(postController.getAllPostOfUserAndPublic);
Router.patch("/like/:id", postController.toggleLikePost);




export const postRoutes = Router;
