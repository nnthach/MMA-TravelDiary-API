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
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params; // lấy id từ URL param
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing user ID" });
    }
    const data = req.body; // dữ liệu update

    const updatedUser = await userService.update(id, data);
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params; // lấy id từ URL param
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

const getListUsers = async (req, res, next) => {
  try {
    // Nếu cần, có thể lấy filter, pagination từ query params
    const { limit = 10, skip = 0 } = req.query;

    // gọi service lấy danh sách user với limit và skip
    const users = await userService.listUsers(
      {},
      {
        limit: parseInt(limit, 10),
        skip: parseInt(skip, 10),
      }
    );

    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    console.log("email forgot password", req.body.email);
    const forgotPassword = await userService.forgotPassword(req.body.email);

    res.status(StatusCodes.OK).json({ message: "Check your email..." });
  } catch (error) {
    console.log("error forgot password", error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    console.log("reset password body", req.body);
    const resetPassword = await userService.resetPassword(req.body);

    res.status(StatusCodes.OK).json(resetPassword);
  } catch (error) {
    console.log("error forgot password", error);
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    console.log("email resend otp", req.body.email);
    const resendOTP = await userService.resendOTP(req.body.email);

    res.status(StatusCodes.OK).json({ message: "Check your email..." });
  } catch (error) {
    console.log("error resendOTP", error);
    next(error);
  }
};

export const userController = {
  getListUsers,
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  resendOTP,
};
