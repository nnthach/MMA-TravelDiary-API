/* eslint-disable no-useless-catch */
import { storageModel } from "~/models/storageModel";
import { storageRoute } from "~/routes/v1/storageRoute";
import { ObjectId } from "mongodb";
import { postModel } from "~/models/postModel";

const addPostToStorage = async (reqBody) => {
  try {
    // Call model
    const addPostToStorage = await storageModel.addPostToStorage(reqBody);

    // const findStorage = await storageModel.findStorageById(
    //   addPostToStorage.insertedId
    // );

    // return data to controller
    return addPostToStorage;
  } catch (error) {
    throw error;
  }
};

const getAllStorage = async () => {
  try {
    // Call model
    const getAllStorage = await storageModel.getAllStorage();

    // return data to controller
    return getAllStorage;
  } catch (error) {
    throw error;
  }
};

const getStorageOfUser = async (id) => {
  try {
    console.log("service get",id);
    // Call model
    const getStorageOfUser = await storageModel.getStorageOfUser(id);
    console.log('in service got storage',getStorageOfUser)
    const postListId = getStorageOfUser?.posts || []
    console.log('postListId',postListId)
    const posts = await postModel.findAllPostInStorage(postListId)

    // return data to controller
    return posts;
  } catch (error) {
    throw error;
  }
};

export const storageService = {
  addPostToStorage,
  getAllStorage,
  getStorageOfUser,
};
