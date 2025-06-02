/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel.js";
import ApiError from "~/utils/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import Joi from "joi";

const registerUser = async (reqBody) => {
  try {
    // handle logic before send to model
    const isExistedEmail = await userModel.findUserByFilter({
      email: reqBody.email,
    });
    console.log("isExistedEmail", isExistedEmail);
    if (isExistedEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email is existed");
    }

    const isExistedUsername = await userModel.findUserByFilter({
      username: reqBody.username,
    });
    console.log("isExistedUsername", isExistedUsername);
    if (isExistedUsername) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Username is existed");
    }

    // Call model
    const registerUser = await userModel.registerUser(reqBody);
    const findUser = await userModel.findUserById(registerUser.insertedId);

    // Return the full user data from DB
    return findUser;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (reqBody) => {
  try {
    const { account, password } = reqBody;
    const isEmail = Joi.string().email().validate(account).error === undefined;
    console.log("isEmail", isEmail);

    const accountData = isEmail ? { email: account } : { username: account };

    // check user
    const user = await userModel.findUserByFilter(accountData);
    console.log("tim user login", user);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Not found user");
    }

    // check password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Not found user");
    }

    // All correct
    if (user && isMatchPassword) {
      // Call model
      const loginUser = await userModel.loginUser(user);

      // Return the full user data from DB
      return loginUser;
    }
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    // Call model
    const findUser = await userModel.findUserById(id);

    // Return the full user data from DB
    return findUser;
  } catch (error) {
    throw error;
  }
};
const update = async (id, data) => {
  try {
    return await userModel.updateUserById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    return await userModel.deleteUserById(id);
  } catch (error) {
    throw error;
  }
};
const listUsers = async (filter = {}, options = {}) => {
  try {
    const users = await userModel.listUsers(filter, options);
    return users;
  } catch (error) {
    throw error;
  }
};
const createUser = async (data) => {
  // kiểm tra dữ liệu, ví dụ email, username tồn tại, ...
  const existEmail = await userModel.findUserByFilter({ email: data.email });
  if (existEmail) throw new ApiError(StatusCodes.BAD_REQUEST, "Email đã tồn tại");

  const existUsername = await userModel.findUserByFilter({ username: data.username });
  if (existUsername) throw new ApiError(StatusCodes.BAD_REQUEST, "Username đã tồn tại");

  // gọi model tạo user
  const newUser = await userModel.createUser(data);
  return newUser;
};


export const userService = {
  registerUser,
  createUser,      // thêm hàm này vào export
  getById,
  update,
  deleteUser,
  loginUser,
  listUsers,  
};
