/* eslint-disable no-useless-catch */
import { storageModel } from "~/models/storageModel";
import { storageRoute } from "~/routes/v1/storageRoute";
import { ObjectId } from "mongodb";

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
  console.log("storage getall serivce");

  try {
    // Call model
    const getAllStorage = await storageModel.getAllStorage();

    // return data to controller
    return getAllStorage;
  } catch (error) {
    throw error;
  }
};

export const storageService = {
  addPostToStorage,
  getAllStorage,
};
