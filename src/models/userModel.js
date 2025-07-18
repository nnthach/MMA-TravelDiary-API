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
  name: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password does not match the password.",
      "any.required": "Confirm password is required.",
    }),
  role: Joi.string().default("User"),
  refreshToken: Joi.string().default(""),
  avatar: Joi.string().default(""),
  otp: Joi.string().default(""),
  otpExpire: Joi.date().default(null),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null),
});

const USER_UPDATE_SCHEMA = Joi.object({
  username: Joi.string().min(6).max(20).optional(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string(),
  password: Joi.string().min(6).max(20).optional(),
  avatar: Joi.string().allow(null),
  otp: Joi.string().allow(null),
  otpExpire: Joi.date().allow(null),
  updatedAt: Joi.date().default(() => new Date()),
}).min(1);

// Validate dữ liệu trước khi tạo mới
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
    allowUnknown: true,
  });
};

// Validate dữ liệu trước khi update
const validateBeforeUpdate = async (data) => {
  return await USER_UPDATE_SCHEMA.validateAsync(data, {
    abortEarly: false,
    allowUnknown: true,
  });
};

// Register user
const registerUser = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    validData.password = hashPassword;

    delete validData.confirm_password; // Không đưa vào database

    const registerUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);

    return registerUser;
  } catch (error) {
    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    throw new Error(error);
  }
};

// Login
const loginUser = async (data) => {
  const payload = {
    userId: data._id.toString(),
    username: data.username,
    role: data.role,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  });

  // set rftoken to DB
  await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
    { _id: data._id },
    {
      $set: { refreshToken },
    }
  );

  return {
    statusCode: StatusCodes.OK,
    userId: data._id.toString(),
    role: data.role,
    accessToken,
    refreshToken,
  };
};

// Read user by ID
const findUserById = async (id) => {
  console.log("revice id", id);
  try {
    const foundUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return foundUser;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Read user by filter (e.g., email, username)
const findUserByFilter = async (filter) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne(filter);

    // dung co quang error o day
    return user;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Update user by ID
const updateUserById = async (id, data) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user ID");
    }

    const validData = await validateBeforeUpdate(data);
    validData.updatedAt = new Date();

    if (validData.password) {
      validData.password = await bcrypt.hash(validData.password, saltRounds);
    }

    let objectId;
    if (typeof id === "string") {
      objectId = new ObjectId(id);
    } else if (typeof id === "number") {
      objectId = ObjectId.createFromTime(id);
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user ID type");
    }

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: objectId }, { $set: validData });

    if (result.matchedCount === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Delete user by ID
const deleteUserById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user ID");
    }

    let objectId;
    if (typeof id === "string") {
      objectId = new ObjectId(id);
    } else if (typeof id === "number") {
      objectId = ObjectId.createFromTime(id);
    } else {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user ID type");
    }

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// List users with filter, limit, skip (pagination)
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
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
