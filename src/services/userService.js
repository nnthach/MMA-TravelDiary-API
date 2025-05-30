/* eslint-disable no-useless-catch */
import ApiError from "~/utils/ApiError";
import { slugify } from "~/utils/formatters";

const createNew = async (reqBody) => {
  console.log("Request body in service:", reqBody);

  try {
    // Handle logic data received
    const newUser = {
      ...reqBody,
      slug: slugify(reqBody.name),
    };

    // return data to controller
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
