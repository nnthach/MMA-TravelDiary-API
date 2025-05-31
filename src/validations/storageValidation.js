import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const addPostToStorage = async (req, res, next) => {
  const correcCondition = Joi.object({
    // strict kiểm tra nghiêm ngặt về datatype
    userId: Joi.string().required().strict(),
    posts: Joi.array()
      .items(
        Joi.object({
          postId: Joi.string().required(),
        })
      )
      .default([]),
  });

  try {
    // abortEarly: cho no return full validate
    await correcCondition.validateAsync(req.body, { abortEarly: false });
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
