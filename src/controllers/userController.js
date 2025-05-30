import { StatusCodes } from "http-status-codes";

const createUser = async (req, res, next) => {
  try {
    console.log("Request body in controller:", req.body);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createUser,
};
