/* eslint-disable no-useless-catch */
import { postModel } from "~/models/postModel";
import { slugify } from "~/utils/formatters";
import { ObjectId } from "mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const createPost = async (reqBody) => {
  console.log("create post body in service", reqBody);
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
    if (!ObjectId.isValid(id)) throw new Error("Invalid post ID");

    const objectId = new ObjectId(id);
    const foundPost = await postModel.findPostById(objectId);
    return foundPost;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (id, updateData) => {
  try {
    if (updateData.public == true) {
      const post = await postModel.findPostById(new ObjectId(id));

      if (post.isBanned) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Your post was banned so cannot public"
        );
      }
    }

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
    const filter = { userId: new ObjectId(id) };

    if (query.public === "true") {
      // find public true
      filter.public = true;
    } else if (query.public === "false") {
      // find public false
      filter.public = false;
    } // do not find public

    console.log("filter g", filter);

    const getAllPostOfUser = await postModel.getPostByUserIdAndPublic(filter);
    return getAllPostOfUser;
  } catch (error) {
    throw error;
  }
};
const toggleLikePost = async (postId, userId) => {
  if (!ObjectId.isValid(postId)) throw new Error("Invalid post ID");

  const post = await postModel.findPostById(postId);
  if (!post) throw new Error("Post not found");

  let updatedLikes;
  if (Array.isArray(post.likes) && post.likes.includes(userId)) {
    updatedLikes = post.likes.filter((id) => id !== userId);
  } else {
    updatedLikes = [...(post.likes || []), userId];
  }

  await postModel.updateLikes(postId, updatedLikes);

  return { likes: updatedLikes };
};

// postService.js
const searchPosts = async (query) => {
  const { keyword, province, district, ward, page = 1, limit = 10 } = query;
  const filter = { public: true };

  if (keyword && typeof keyword === "string") {
    const regex = new RegExp(keyword.trim(), "i");
    filter.$or = [
      { title: { $regex: regex } },
      { content: { $regex: regex } },
      { province: { $regex: regex } },
      { district: { $regex: regex } },
      { ward: { $regex: regex } },
    ];
  }

  return await postModel.searchPosts(filter, page, limit);
};

const getRandomPosts = async (limit = 20) => {
  return await postModel.getRandomPosts(limit);
};

export const postService = {
  createPost,
  getAllPost,
  findPostById,
  updatePost,
  deletePost,
  postDetail,
  getAllPostOfUserAndPublic,
  toggleLikePost,
  searchPosts,
  getRandomPosts,
};
