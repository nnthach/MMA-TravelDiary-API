import { StatusCodes } from "http-status-codes";
import { storageService } from "~/services/storageService";

const addPostToStorage = async (req, res, next) => {
  console.log("storage controller", req.body);
  try {
    const addedPostToStorage = await storageService.addPostToStorage(req.body);

    res.status(StatusCodes.CREATED).json(addedPostToStorage);
  } catch (error) {
    next(error);
  }
};

const getAllStorage = async (req, res, next) => {
  console.log("storage get all");

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
