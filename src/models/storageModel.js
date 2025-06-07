
import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const STORAGE_COLLECTION_NAME = "storages";
const STORAGE_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  postIds: Joi.array().items(Joi.string()).default([]),
  isMultiple: Joi.boolean().default(false),
});

// Validate data input 
const validateBeforeCreate = async (data) => {
  return await STORAGE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

// UPDATE
const addNewPostToStorage = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    // Convert Id to ObjectId
    const userId = new ObjectId(validData.userId);
    const postId = new ObjectId(validData.postIds[0]);

    const result = await GET_DB()
      .collection(STORAGE_COLLECTION_NAME)
      .updateOne(
        { userId },
        { $addToSet: { postIds: postId } },
        { upsert: true }
      );

    return result;
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
  getStorageOfUser,
  addNewPostToStorage,
};
