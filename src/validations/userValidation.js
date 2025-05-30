import e from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const createUser = async (req, res, next) => {
  const correcCondition = Joi.object({
    // strict kiểm tra nghiêm ngặt về datatype
    username: Joi.string().min(6).max(20).required().strict().messages({
      "string.max": "Username must be at most 20 characters long.",
      "string.min": "Username must be at least 6 characters long.",
    }),
    password: Joi.string().min(6).max(20).required().strict(),
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(50).required().strict(),
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

export const userValidation = {
  createUser,
};
