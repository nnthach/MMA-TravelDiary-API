// Define collection (name and schema)

import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

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
                postId: new ObjectId(validData.posts[0].postId)
              }
            ]  
      };

    console.log('new data add', newData)

    const createdPost = await GET_DB()
      .collection(STORAGE_COLLECTION_NAME)
      .insertOne(newData);

    return createdPost;
  } catch (error) {
    // Error cua model thuong la loi he thong ko can bat error qua khắc khe
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
    // Error cua model thuong la loi he thong ko can bat error qua khắc khe
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

export const storageModel = {
  STORAGE_COLLECTION_NAME,
  STORAGE_COLLECTION_SCHEMA,
  addPostToStorage,
  findStorageById,
  getAllStorage,
};
