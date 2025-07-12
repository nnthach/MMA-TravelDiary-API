import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const createPost = async (req, res, next) => {
  const correcCondition = Joi.object({
    // strict kiểm tra nghiêm ngặt về datatype
    userId: Joi.string().required(),
    username: Joi.string().required(),
    title: Joi.string().min(6).max(50).required().strict().messages({
      "string.max": "Title must be at most 50 characters long.",
      "string.min": "Title must be at least 6 characters long.",
    }),
    content: Joi.string().max(1000).required().strict(),
    images: Joi.array()
      .items(
        Joi.object({
          uri: Joi.string().uri(),
          type: Joi.string().valid("image", "video"),
        })
      )
      .default([]),
  });

  try {
    // abortEarly: cho no return full validate
    await correcCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
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

export const postValidation = {
  createPost,
};
