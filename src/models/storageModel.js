// Define collection (name and schema)

import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const STORAGE_COLLECTION_NAME = "storages";
// Define the schema for the user collection
const STORAGE_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  posts: Joi.array()
    .items(
      Joi.object({
        postId: Joi.string().required(),
      })
    )
    .default([]),
  isMultiple: Joi.boolean().default(false),
});

// Validate data before creating a new user
const validateBeforeCreate = async (data) => {
  return await STORAGE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const addPostToStorage = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newData = {
      ...validData,
      userId: new ObjectId(validData.userId),
      posts: [
        {
          postId: new ObjectId(validData.posts[0].postId),
        },
      ],
    };

    const userHadStorage = await GET_DB()
      .collection(STORAGE_COLLECTION_NAME)
      .findOne({ userId: newData.userId });

    if (userHadStorage) {
      const result = await GET_DB()
        .collection(STORAGE_COLLECTION_NAME)
        .updateOne(
          { userId: newData.userId },
          { $addToSet: { posts: { postId: newData.posts[0].postId } } }
        );

      // modified count = 0 => ko gi update
      if (result.modifiedCount === 0) {
        throw new ApiError(StatusCodes.CONFLICT, "post already existed");
      }
      return {
        statusCode: StatusCodes.OK,
        message: "Saved post",
      };
    }

    const createdPost = await GET_DB()
      .collection(STORAGE_COLLECTION_NAME)
      .insertOne(newData);

    return {
      statusCode: StatusCodes.CREATED,
      createdPost,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const findStorageById = async (id) => {
  try {
    const foundStorage = await GET_DB()
      .collection(STORAGE_COLLECTION_NAME)
      .findOne({ _id: id });

    return foundStorage;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllStorage = async () => {
  try {
    const foundStorage = await GET_DB()
      .collection(STORAGE_COLLECTION_NAME)
      .find({})
      .toArray();

    return foundStorage;
  } catch (error) {
    throw new Error(error);
  }
};

const getStorageOfUser = async (id) => {
  try {
    const foundStorage = await GET_DB()
      .collection(STORAGE_COLLECTION_NAME)
      .findOne({ userId: new ObjectId(id) });

    return foundStorage;
  } catch (error) {
    throw new Error(error);
  }
};



export const storageModel = {
  STORAGE_COLLECTION_NAME,
  STORAGE_COLLECTION_SCHEMA,
  addPostToStorage,
  findStorageById,
  getAllStorage,
  getStorageOfUser,
};
