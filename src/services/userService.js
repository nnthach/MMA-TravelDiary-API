/* eslint-disable no-useless-catch */
import { userModel } from "~/models/userModel.js";
import { slugify } from "~/utils/formatters.js";

const createNew = async (reqBody) => {
  try {
    // Handle logic data received
    const newUser = {
      ...reqBody,
      slug: slugify(reqBody.name),
    };

    // Call model
    const createdUser = await userModel.createUser(newUser);
    const findUser = await userModel.findUserById(createdUser.insertedId);

    // Return the full user data from DB
    return findUser;
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

export const userService = {
  createNew,
  getById,
  update,
  deleteUser,
};
