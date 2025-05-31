import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";

// const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await userService.getAll();
//     res.status(StatusCodes.OK).json(users);
//   } catch (error) {
//     next(error);
//   }
// };

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

// const updateUser = async (req, res, next) => {
//   try {
//     const updatedUser = await userService.update(req.params.id, req.body);
//     res.status(StatusCodes.OK).json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteUser = async (req, res, next) => {
//   try {
//     await userService.delete(req.params.id);
//     res.status(StatusCodes.OK).json({ message: "User deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

export const userController = {
  // getAllUsers,
  createUser,
  getUserById,
  // updateUser,
  // deleteUser,
};
