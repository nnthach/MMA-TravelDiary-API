/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel.js";
import ApiError from "~/utils/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import Joi from "joi";
import { GET_DB } from "~/config/mongodb";

const registerUser = async (reqBody) => {
  try {
    // handle logic before send to model
    const isExistedEmail = await userModel.findUserByFilter({
      email: reqBody.email,
    });
    if (isExistedEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email is existed");
    }

    const isExistedUsername = await userModel.findUserByFilter({
      username: reqBody.username,
    });
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

    const accountData = isEmail ? { email: account } : { username: account };

    // check user
    const user = await userModel.findUserByFilter(accountData);
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
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Fail to login");
  }
};

const refreshToken = async (reqBody) => {
  try {
    const isValidRFToken = await userModel.findUserByFilter({
      refreshToken: reqBody.refreshToken,
    });

    console.log("isValid token", isValidRFToken);

    if (!isValidRFToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        reqBody.refreshToken,
        env.JWT_REFRESH_SECRET,
        (err, decoded) => {
          console.log("err", err), console.log("decoded", decoded);

          if (err) reject(new ApiError(StatusCodes.FORBIDDEN, err.message));
          else resolve(decoded);
        }
      );
    });

    const payload = {
      userId: decoded.userId,
      username: decoded.username,
    };

    const newAccessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE,
    });

    return {
      statusCode: StatusCodes.OK,
      accessToken: newAccessToken,
    };
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

export const userService = {
  registerUser,
  getById,
  update,
  deleteUser,
  loginUser,
  refreshToken,
  listUsers,
};
