/* eslint-disable no-useless-catch */
import { postModel } from "~/models/postModel";
import { slugify } from "~/utils/formatters";
import { ObjectId } from "mongodb";

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

const findPostById = async (id) => {
  try {
    const objectId = new ObjectId(id);
    const foundPost = await postModel.findPostById(objectId);
    return foundPost;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (id, updateData) => {
  try {
    const updatedPost = await postModel.updatePost(id, updateData);
    return updatedPost;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (id) => {
  try {
    const deleted = await postModel.deletePost(id);
    return deleted;
  } catch (error) {
    throw error;
  }
};

const postDetail = async (postId, detail) => {
  try {
    const updatedPost = await postModel.postDetail(postId, detail);
    return updatedPost;
  } catch (error) {
    throw error;
  }
};

const getAllPostOfUser = async (id) => {
  try {
    const getAllPostOfUser = await postModel.getPostByUserId(id);
    return getAllPostOfUser;
  } catch (error) {
    throw error;
  }
};

export const postService = {
  createPost,
  getAllPost,
  findPostById,
  updatePost,
  deletePost,
  postDetail,
  getAllPostOfUser,
};
