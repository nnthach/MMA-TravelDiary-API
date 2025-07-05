import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const sendReport = async (req, res, next) => {
  console.log("send report validate");
  const correcCondition = Joi.object({
    // strict kiểm tra nghiêm ngặt về datatype
    reporterId: Joi.string().required(),
    postId: Joi.string().required(),
    reason: Joi.string().required(),
    description: Joi.string().max(200).required(),
  });

  try {
    console.log("send report validate body", req.body);

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

export const reportValidation = {
  sendReport,
};
