import { StatusCodes } from "http-status-codes";
import { storageService } from "~/services/storageService";

// (PATCH) CREATE/UPDATE
const addPostToStorage = async (req, res, next) => {
  try {
    const addedPostToStorage = await storageService.addPostToStorage(
      req.params.userId,
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
const removePostInStorage = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;
    const result = await storageService.removePostInStorage(userId, postId);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Post not found in storage." });
    }

    res.status(StatusCodes.OK).json({ message: "Updated storage" });
  } catch (error) {
    next(error);
  }
};

// (GET)
const getStorageOfUser = async (req, res, next) => {
  try {
    const getStorageOfUser = await storageService.getStorageOfUser(
      req.params.userId
    );

    res.status(StatusCodes.OK).json(getStorageOfUser);
  } catch (error) {
    next(error);
  }
};

export const storageController = {
  addPostToStorage,
  getStorageOfUser,
  removePostInStorage,
};
