import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";

const createUser = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  console.log("controler user id");
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
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing user ID" });
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
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing user ID" });
    }
    await userService.delete(id);
    res.status(StatusCodes.OK).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};


export const userController = {
  // getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
