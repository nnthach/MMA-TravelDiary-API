import { userModel } from '~/models/userModel.js';
import { slugify } from '~/utils/formatters.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const getAll = async () => {
  return await userModel.getAllUsers();
};

const createNew = async (reqBody) => {
  if (!reqBody || !reqBody.name) {
    throw new Error('Name is required to create slug');
  }
  if (!reqBody.password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await bcrypt.hash(reqBody.password, SALT_ROUNDS);

  const newUser = {
    ...reqBody,
    password: hashedPassword,
    slug: slugify(reqBody.name),
    createdAt: new Date(),
  };

  const createdUser = await userModel.createUser(newUser);
  return createdUser;
};

const getById = async (id) => {
  if (!id) throw new Error('User ID is required');
  return await userModel.getUserById(id);
};

const update = async (id, updateData) => {
  if (!id) throw new Error('User ID is required');
  if (!updateData) {
    throw new Error('No update data provided');
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
  }

  if (updateData.name) {
    updateData.slug = slugify(updateData.name);
  }

  updateData.updatedAt = new Date();

  return await userModel.updateUser(id, updateData);
};

const deleteUser = async (id) => {
  if (!id) throw new Error('User ID is required');
  return await userModel.deleteUser(id);
};

export const userService = {
  getAll,
  createNew,
  getById,
  update,
  delete: deleteUser,
};
