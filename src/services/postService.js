/* eslint-disable no-useless-catch */
import { postModel } from "~/models/postModel";
import { slugify } from "~/utils/formatters";

const createPost = async (reqBody) => {
  try {
    // Handle logic data received
    const newPost = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    // Call model
    const createdPost = await postModel.createPost(newPost);

    const findPost = await postModel.findPostById(createdPost.insertedId);

    // return data to controller
    return findPost;
  } catch (error) {
    throw error;
  }
};

const getAllPost = async (reqBody) => {
  try {
    // Call model
    const getAllPost = await postModel.getAllPost();

    // return data to controller
    return getAllPost;
  } catch (error) {
    throw error;
  }
};

export const postService = {
  createPost,
  getAllPost,
};
