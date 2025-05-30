import { StatusCodes } from "http-status-codes";

const createUser = async (req, res, next) => {
  try {
    console.log("Request body in controller:", req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Controller: User created successfully " });
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

export const userController = {
  createUser,
};
