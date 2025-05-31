import { StatusCodes } from "http-status-codes";
import { storageService } from "~/services/storageService";

const addPostToStorage = async (req, res, next) => {
  try {
    const addedPostToStorage = await storageService.addPostToStorage(req.body);

    res.status(StatusCodes.CREATED).json(addedPostToStorage);
  } catch (error) {
    next(error);
  }
};

export const storageController = {
  addPostToStorage,
};
