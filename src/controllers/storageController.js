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

const getAllStorage = async (req, res, next) => {
  try {
    const getAllStorage = await storageService.getAllStorage();

    res.status(StatusCodes.OK).json(getAllStorage);
  } catch (error) {
    next(error);
  }
};

const getStorageOfUser = async (req, res, next) => {
  try {
    console.log('get controller', req.params.id)
    const getStorageOfUser = await storageService.getStorageOfUser(req.params.id);

    res.status(StatusCodes.OK).json(getStorageOfUser);
  } catch (error) {
    next(error);
  }
};

export const storageController = {
  addPostToStorage,
  getAllStorage,
  getStorageOfUser,
};
