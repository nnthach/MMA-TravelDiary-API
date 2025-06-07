/* eslint-disable no-useless-catch */
import { storageModel } from "~/models/storageModel";
import { postModel } from "~/models/postModel";

const addPostToStorage = async (userId, reqBody) => {
  try {
    const payload = {
      userId,
      postIds: [reqBody.postId],
    };

    const result = await storageModel.addNewPostToStorage(payload);

    // // Find storage
    // const exitedStorage = await storageModel.getStorageOfUser(reqBody.userId);

    // if (!exitedStorage) {
    //   const createNewStorage = await storageModel.createNewStorage(payload);

    //   return createNewStorage;
    // } else {
    //   const addNewPostToStorage = await storageModel.addNewPostToStorage(
    //     payload
    //   );
    //   return addNewPostToStorage;
    // }
    return result;
  } catch (error) {
    throw error;
  }
};

const getStorageOfUser = async (id) => {
  try {
    // check isExitStorage
    const getStorageOfUser = await storageModel.getStorageOfUser(id);

    if (!getStorageOfUser) {
      return [];
    }

    // get all post in storage
    const posts = await postModel.findAllPostInStorage(
      getStorageOfUser.postIds
    );

    // return data to controller
    return posts;
  } catch (error) {
    throw error;
  }
};

const removePostInStorage = async (userId, postId) => {
  try {
    const removePostInStorage = await storageModel.removePostInStorage(
      userId,
      postId
    );

    // return data to controller
    return removePostInStorage;
  } catch (error) {
    throw error;
  }
};

export const storageService = {
  addPostToStorage,
  getStorageOfUser,
  removePostInStorage,
};
