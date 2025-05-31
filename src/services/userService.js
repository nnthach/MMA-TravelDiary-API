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
  console.log('controler user id')
  try {
    // Call model
    const findUser = await userModel.findUserById(id);

    // Return the full user data from DB
    return findUser;
  } catch (error) {
    console.log('service error',error)
    throw error;
  }
};

export const userService = {
  createNew,
  getById,
  // update,
  // delete: deleteUser,
};

// Handle logic data received
// const newUser = {
//   ...reqBody,
//   slug: slugify(reqBody.name),
// };

// Call model
// const createdUser = await userModel.createUser(newUser);

// const findUser = await userModel.findUserById(createdUser.insertedId);

// // return data to controller
// return findUser;

// const getById = async (id) => {
//   if (!id) throw new Error("User ID is required");
//   return await userModel.getUserById(id);
// };

// const update = async (id, updateData) => {
//   if (!id) throw new Error('User ID is required');
//   if (!updateData) {
//     throw new Error('No update data provided');
//   }

//   if (updateData.password) {
//     updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
//   }

//   if (updateData.name) {
//     updateData.slug = slugify(updateData.name);
//   }

//   updateData.updatedAt = new Date();

//   return await userModel.updateUser(id, updateData);
// };

// const deleteUser = async (id) => {
//   if (!id) throw new Error('User ID is required');
//   return await userModel.deleteUser(id);
// };
