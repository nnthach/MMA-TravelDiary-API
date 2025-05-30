import { StatusCodes } from "http-status-codes";
import Joi from "joi";

const createUser = async (req, res, next) => {
  const correcCondition = Joi.object({
    // strict kiểm tra nghiêm ngặt về datatype
    username: Joi.string().min(6).max(20).required().strict().messages({
      "string.max": "Username must be at most 20 characters long.",
      "string.min": "Username must be at least 6 characters long.",
    }),
    password: Joi.string().min(6).max(20).required().strict(),
    email: Joi.string().email().required(),
  });

  try {
    console.log("Validating user data:", req.body);

    // abortEarly: cho no return full validate
    await correcCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log("Error in user validation:", error);
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};

export const userValidation = {
  createUser,
};
