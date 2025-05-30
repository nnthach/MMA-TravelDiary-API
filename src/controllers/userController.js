import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";

const createUser = async (req, res, next) => {
  try {
    console.log("Request body in controller:", req.body);

    const createdUser = await userService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createUser,
};
