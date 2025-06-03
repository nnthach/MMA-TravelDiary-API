import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";

const registerUser = async (req, res, next) => {
  try {
    const registerUser = await userService.registerUser(req.body);

    res.status(StatusCodes.CREATED).json(registerUser);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const loginUser = await userService.loginUser(req.body);

    res.status(StatusCodes.OK).json(loginUser);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log("controller error", error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id, ...data } = req.body;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing user ID" });
    }
    const updatedUser = await userService.update(id, data);
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing user ID" });
    }
    await userService.deleteUser(id);
    res.status(StatusCodes.OK).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  // getAllUsers,
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  refreshToken,
};
