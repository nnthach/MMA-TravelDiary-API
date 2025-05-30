/* eslint-disable no-useless-catch */
import { userModel } from "~/models/userModel";
import { slugify } from "~/utils/formatters";

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

    // return data to controller
    return findUser;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
