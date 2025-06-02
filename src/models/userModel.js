import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";

// Validate ObjectId với Joi
const validateObjectId = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error("any.invalid"); // Trả về lỗi nếu không hợp lệ
  }
  return value;
};

const saltRounds = 10;

const USER_COLLECTION_NAME = "users";
// Cập nhật schema để validate ObjectId cho `id`
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().min(6).max(20).required(),
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password does not match the password.",
      "any.required": "Confirm password is required.",
    }),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null),
});

const USER_UPDATE_SCHEMA = Joi.object({
  username: Joi.string().min(6).max(20).optional(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(20).optional(),
  updatedAt: Joi.date().default(() => new Date()),
}).min(1);

// Validate dữ liệu trước khi tạo mới
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

// Validate dữ liệu trước khi update
const validateBeforeUpdate = async (data) => {
  return await USER_UPDATE_SCHEMA.validateAsync(data, { abortEarly: false });
};

// Register user
const registerUser = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    validData.password = hashPassword;

    delete validData.confirm_password; // ko dua vao database

    const registerUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);

    return registerUser;
  } catch (error) {
    throw new Error(error);
  }
};

// Login
const loginUser = async (data) => {
  // payload: du lieu luu tru trong token
  const payload = {
    userId: data._id.toString(),
    username: data.username,
  };

  // jwt sercret key lay tren https://www.uuidgenerator.net/
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  });

  return {
    statusCode: StatusCodes.OK,
    userId: data._id.toString(),
    accessToken,
    refreshToken,
  };
};

// Read user by ID
const findUserById = async (id) => {
  try {
    const foundUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return foundUser;
  } catch (error) {
    throw new Error(error);
  }
};

// Read user by filter (e.g. email, username)
const findUserByFilter = async (filter) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne(filter);
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

// Update user by ID
const updateUserById = async (id, data) => {
  try {
    // Validate id với Joi trước khi tiếp tục
    const validId = await Joi.string()
      .custom(validateObjectId, "validate ObjectId")
      .validateAsync(id);

    const validData = await validateBeforeUpdate(data);
    // Tự động cập nhật updatedAt nếu chưa có
    if (!validData.updatedAt) {
      validData.updatedAt = Date.now();
    }

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(validId) }, { $set: validData });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Delete user by ID
const deleteUserById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Lấy danh sách user với filter, limit, skip (phân trang)
const listUsers = async (filter = {}, options = {}) => {
  try {
    const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;
    const cursor = GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort);

    const users = await cursor.toArray();
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  registerUser,
  findUserById,
  findUserByFilter,
  updateUserById,
  deleteUserById,
  listUsers,
  loginUser,
};
