import { StatusCodes } from "http-status-codes";
import { storageService } from "~/services/storageService";

// (PATCH) CREATE/UPDATE
const addPostToStorage = async (req, res, next) => {
  try {
    const addedPostToStorage = await storageService.addPostToStorage(
      req.params.id,
      req.body
    );

    if (addedPostToStorage.upsertedCount === 1) {
      // Tạo mới storage
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Saved post", addedPostToStorage });
    } else if (addedPostToStorage.modifiedCount === 1) {
      // Cập nhật storage
      res
        .status(StatusCodes.OK)
        .json({ message: "Saved post", addedPostToStorage });
    } else {
      // Không thay đổi gì
      res
        .status(StatusCodes.OK)
        .json({ message: "Post already available", addedPostToStorage });
    }
  } catch (error) {
    next(error);
  }
};

// (GET)
const getStorageOfUser = async (req, res, next) => {
  try {
    const getStorageOfUser = await storageService.getStorageOfUser(
      req.params.id
    );

    res.status(StatusCodes.OK).json(getStorageOfUser);
  } catch (error) {
    next(error);
  }
};

export const storageController = {
  addPostToStorage,
  getStorageOfUser,
};
