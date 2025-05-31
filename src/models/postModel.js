// Define collection (name and schema)

import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const POST_COLLECTION_NAME = "posts";
// Define the schema for the user collection
const POST_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(6).max(50).required(),
  content: Joi.string().max(1000).required().strict(),
  images: Joi.array().items(Joi.string()).default([]),
  slug: Joi.string().optional(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  postDetails: Joi.array().items(
    Joi.object({
      date: Joi.date().required(),
      location: Joi.string().max(100).required(),
      note: Joi.string().max(1000),
      images: Joi.array().items(Joi.string()).default([])
    })
  ).default([]),
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

const updatePost = async(id, updateData) => {
  try {
    const updatePost = await GET_DB()
    .collection(POST_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updateData: Date.now(),
        },
      },
      {returnDocument: "after"}
    );
    return updatePost;
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async(id) => {
  try {
    const result = await GET_DB()
    .collection(POST_COLLECTION_NAME)
    .deleteOne({_id: new ObjectId(id)});

    return result.deletedCount === 1;
  } catch (error) {
    throw new Error(error);
  }
};

const postDetail = async(postId, detail) => {
  try {
    const detailWithDate = {
      ...detail,
      date: new Date(detail.date)
    };

    const result = await GET_DB()
    .collection(POST_COLLECTION_NAME)
    .findOneAndUpdate(
      {_id: new ObjectId(postId)},
      { $push: {postDetails: detailWithDate}, $set: {updatedAt: Date.now()}},
      { returnDocument: "after"}
    );

    return result.value;
  } catch (error) {
    throw new Error(error);
  }
}

export const postModel = {
  POST_COLLECTION_NAME,
  POST_COLLECTION_SCHEMA,
  createPost,
  findPostById,
  getAllPost,
  updatePost,
  deletePost,
  postDetail,
};
