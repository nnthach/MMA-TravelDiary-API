// Define collection (name and schema)

import Joi from "joi";
import { GET_DB } from "~/config/mongodb";

const POST_COLLECTION_NAME = "post";
// Define the schema for the user collection
const POST_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(6).max(50).required(),
  content: Joi.string().max(1000).required().strict(),
  images: Joi.array().items(Joi.string()).default([]),
  slug: Joi.string().optional(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

// Validate data before creating a new user
const validateBeforeCreate = async (data) => {
  return await POST_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createPost = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    const createdPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .insertOne(validData);

    return createdPost;
  } catch (error) {
    // Error cua model thuong la loi he thong ko can bat error qua khắc khe
    throw new Error(error);
  }
};

const findPostById = async (id) => {
  try {
    const foundPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOne({ _id: id });

    return foundPost;
  } catch (error) {
    // Error cua model thuong la loi he thong ko can bat error qua khắc khe
    throw new Error(error);
  }
};

const getAllPost = async () => {
  try {
    const getAllPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find()
      .toArray();

    return getAllPost;
  } catch (error) {
    // Error cua model thuong la loi he thong ko can bat error qua khắc khe
    throw new Error(error);
  }
};

export const postModel = {
  POST_COLLECTION_NAME,
  POST_COLLECTION_SCHEMA,
  createPost,
  findPostById,
  getAllPost,
};
