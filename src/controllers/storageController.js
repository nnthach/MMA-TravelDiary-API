import { StatusCodes } from "http-status-codes";
import { storageService } from "~/services/storageService";

const addPostToStorage = async (req, res, next) => {
  try {
    const addedPostToStorage = await storageService.addPostToStorage(req.body);
    console.log("addedpost in controller", addedPostToStorage);

    res.status(StatusCodes.OK).json(addedPostToStorage);
  } catch (error) {
    next(error);
  }
};

const getAllStorage = async (req, res, next) => {
  try {
    const getAllStorage = await storageService.getAllStorage();

    res.status(StatusCodes.OK).json(getAllStorage);
  } catch (error) {
    next(error);
  }
};

export const storageController = {
  addPostToStorage,
  getAllStorage,
};
