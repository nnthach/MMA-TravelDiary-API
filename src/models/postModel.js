// Define collection (name and schema)

import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const POST_COLLECTION_NAME = "posts";
// Define the schema for the user collection
const POST_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  username: Joi.string().required(),
  title: Joi.string().min(6).max(50).required(),
  content: Joi.string().max(1000).required().strict(),
  images: Joi.array().items(Joi.string()).default([]),
  slug: Joi.string().optional(),
  location: Joi.string().default(""),
  city: Joi.string().default(""),
  country: Joi.string().default(""),
  public: Joi.boolean().default(false),
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
    throw new Error(error);
  }
};

const updatePost = async (id, updateData) => {
  console.log("id post update in model", id);
  console.log("data post update in model", updateData);
  try {
    const newUpdateData = {
      ...updateData,
      updatedAt: new Date(),
    };

    const updatePost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: newUpdateData },
        { returnDocument: "after" }
      );
    console.log("updatedpost in model", updatePost);
    return updatePost;
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async (id) => {
  try {
    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  } catch (error) {
    throw new Error(error);
  }
};

const postDetail = async (postId, detail) => {
  try {
    const detailWithDate = {
      ...detail,
      date: new Date(detail.date),
    };

    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(postId) },
        {
          $push: { postDetails: detailWithDate },
          $set: { updatedAt: Date.now() },
        },
        { returnDocument: "after" }
      );

    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const findAllPostInStorage = async (data) => {
  try {
    // $in chỉ nhận array ko nhận array object nên phải convert
    const foundPostList = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find({ _id: { $in: data } })
      .toArray();

    return foundPostList;
  } catch (error) {
    throw new Error(error);
  }
};

const getPostByUserIdAndPublic = async (filter) => {
  try {
    const getAllPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find(filter)
      .toArray();

    console.log("get all post", getAllPost);

    return getAllPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const postModel = {
  POST_COLLECTION_NAME,
  POST_COLLECTION_SCHEMA,
  createPost,
  findPostById,
  getAllPost,
  updatePost,
  deletePost,
  postDetail,
  findAllPostInStorage,
  getPostByUserIdAndPublic,
};
