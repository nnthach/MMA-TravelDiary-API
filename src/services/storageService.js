/* eslint-disable no-useless-catch */
import { storageModel } from "~/models/storageModel";
import { storageRoute } from "~/routes/v1/storageRoute";

const addPostToStorage = async (reqBody) => {
  try {
    // Call model
    const addPostToStorage = await storageModel.addPostToStorage(reqBody);

    const findStorage = await storageModel.findStorageById(
      addPostToStorage.insertedId
    );

    // return data to controller
    return findStorage;
  } catch (error) {
    throw error;
  }
};

export const storageService = {
  addPostToStorage,
};
