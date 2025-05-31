import { StatusCodes } from "http-status-codes";
import { postService } from "~/services/postService";

const createPost = async (req, res, next) => {
  try {
    const createdPost = await postService.createPost(req.body);

    res.status(StatusCodes.CREATED).json(createdPost);
  } catch (error) {
    next(error);
  }
};

const getAllPost = async (req, res, next) => {
  try {
    const getAllPost = await postService.getAllPost();

    res.status(StatusCodes.OK).json(getAllPost);
  } catch (error) {
    next(error);
  }
};

export const postController = {
  createPost,
  getAllPost,
};
