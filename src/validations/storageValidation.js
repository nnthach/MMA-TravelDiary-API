import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const addPostToStorage = async (req, res, next) => {
  const correcCondition = Joi.object({
    // strict kiểm tra nghiêm ngặt về datatype
    postId: Joi.string().required(),
  });

  try {
    // abortEarly: cho no return full validate
    await correcCondition.validateAsync(req.body, { abortEarly: false,allowUnknown: true });
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError); // chay vao error handling middleware
  }
};

export const storageValidation = {
  addPostToStorage,
};
