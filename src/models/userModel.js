import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

// Validate ObjectId với Joi
const validateObjectId = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error("any.invalid");  // Trả về lỗi nếu không hợp lệ
  }
  return value;
};

const USER_COLLECTION_NAME = "users";

// Cập nhật schema để validate ObjectId cho `id`
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().min(6).max(20).required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  slug: Joi.string().optional(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null),
});

const USER_UPDATE_SCHEMA = Joi.object({
  username: Joi.string().min(6).max(20).optional(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(20).optional(),
  slug: Joi.string().optional(),
  updatedAt: Joi.date().default(() => new Date()),
}).min(1);

// Validate dữ liệu trước khi tạo mới
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

// Validate dữ liệu trước khi update
const validateBeforeUpdate = async (data) => {
  return await USER_UPDATE_SCHEMA.validateAsync(data, { abortEarly: false });
};

// Create user
const createUser = async (data) => {
  try {
    console.log("createUser data:", data);  // Debug data nhận vào
    const validData = await validateBeforeCreate(data);
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);
    return createdUser;
  } catch (error) {
    console.error("createUser error:", error);
    throw new Error(error);
  }
};

// Read user by ID
const findUserById = async (id) => {
  try {
    // Validate id với Joi trước khi tiếp tục
    const validId = await Joi.string().custom(validateObjectId, "validate ObjectId").validateAsync(id);
    
    const foundUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(validId) });
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
    const validId = await Joi.string().custom(validateObjectId, "validate ObjectId").validateAsync(id);

    const validData = await validateBeforeUpdate(data);
    // Tự động cập nhật updatedAt nếu chưa có
    if (!validData.updatedAt) {
      validData.updatedAt = Date.now();
    }

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(validId) },
        { $set: validData }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Delete user by ID
const deleteUserById = async (id) => {
  try {
    // Validate id với Joi trước khi tiếp tục
    const validId = await Joi.string().custom(validateObjectId, "validate ObjectId").validateAsync(id);

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(validId) });
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
  createUser,
  findUserById,
  findUserByFilter,
  updateUserById,
  deleteUserById,
  listUsers,
};
