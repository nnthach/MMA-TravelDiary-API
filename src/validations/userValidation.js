import e from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const registerUser = async (req, res, next) => {
  const correcCondition = Joi.object({
    // strict kiểm tra nghiêm ngặt về datatype
    username: Joi.string().min(6).max(20).required().strict().messages({
      "string.max": "Username must be at most 20 characters long.",
      "string.min": "Username must be at least 6 characters long.",
    }),
    password: Joi.string().min(6).max(20).required().strict(),
    email: Joi.string().email().required(),
    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm password does not match the password.",
        "any.required": "Confirm password is required.",
      }),
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

export const userValidation = {
  registerUser,
};
