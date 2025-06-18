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

const getAllPost = async (query) => {
  console.log("query serive", query);
  try {
    const filter = {};

    if (query.public === "true") {
      // find public true
      filter.public = true;
    } else if (query.public === "false") {
      // find public false
      filter.public = false;
    } // do not find public

    // Call model
    const getAllPost = await postModel.getAllPost(filter);

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

const getAllPostOfUserAndPublic = async (id, query) => {
  try {
    const filter = { userId: id };

    if (query.public === "true") {
      // find public true
      filter.public = true;
    } else if (query.public === "false") {
      // find public false
      filter.public = false;
    } // do not find public

    const getAllPostOfUser = await postModel.getPostByUserIdAndPublic(filter);
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
  getAllPostOfUserAndPublic,
};
