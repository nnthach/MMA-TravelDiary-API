/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel.js";
import ApiError from "~/utils/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import nodemailer from "nodemailer";
import { saveOTPToUser } from "~/utils/createOTP";

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
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      error.message || "Fail to register"
    );
  }
};

const loginUser = async (reqBody) => {
  try {
    const { account, password } = reqBody;
    const isEmail = Joi.string().email().validate(account).error === undefined;

    const accountData = isEmail ? { email: account } : { username: account };

    // check user
    const user = await userModel.findUserByFilter(accountData);
    console.log("user login", user);
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Not found user");
    }

    // check password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    console.log("is match password", isMatchPassword);
    if (!isMatchPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Not found user");
    }

    // All correct
    if (user && isMatchPassword) {
      // Call model
      const loginUser = await userModel.loginUser(user);

      // Return the full user data from DB
      return loginUser;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      error.message || "Fail to login"
    );
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
    if (!findUser) {
      return { message: "Not found" };
    }

    // Return the full user data from DB
    return findUser;
  } catch (error) {
    throw error;
  }
};

const update = async (id, data) => {
  try {
    if (data.email) {
      const isAvailableEmail = await userModel.findUserByFilter({
        email: data.email,
      });
      console.log("isAvailableEmail", isAvailableEmail);

      if (isAvailableEmail) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "This email is already in use"
        );
      }
    }

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

const forgotPassword = async (email) => {
  try {
    const user = await userModel.findUserByFilter({ email });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid email");
    }

    const otp = await saveOTPToUser(user._id);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_APP_NAME,
        pass: env.EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"Travel Diary" <nguyenngocthach2301@gmail.com>',
      to: email,
      subject: "Reset Password",
      text: "OTP", // plain‑text body
      html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 5 minutes</p>`, // HTML body
    });
    return info;
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      error.message || "Fail to send email"
    );
  }
};

const resetPassword = async (body) => {
  try {
    const { email, password, otp } = body;
    const user = await userModel.findUserByFilter({ email });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid email");
    }

    if (user.otp !== otp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OTP");
    }

    const currentTime = new Date();
    if (!user.otpExpire || currentTime > user.otpExpire) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "OTP was expired");
    }

    await userModel.updateUserById(user._id.toString(), {
      password,
      otp: null,
      otpExpire: null,
    });

    return { message: "Password reset successfully" };
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      error.message || "Fail to reset password"
    );
  }
};

const resendOTP = async (email) => {
  return await forgotPassword(email);
};

export const userService = {
  registerUser,
  getById,
  update,
  deleteUser,
  loginUser,
  refreshToken,
  listUsers,
  forgotPassword,
  resetPassword,
  resendOTP,
};
