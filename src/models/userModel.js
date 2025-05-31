import mongoose from 'mongoose';

// 1. Định nghĩa schema và model
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100
  },
  slug: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

// Tạo model Mongoose
const User = mongoose.model('User', UserSchema);

// 2. Các hàm thao tác DB dùng Mongoose
const getAllUsers = async () => {
  return await User.find({});
};

const createUser = async (data) => {
  const newUser = new User(data);
  return await newUser.save();
};

const getUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid user id');
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};

const updateUser = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid user id');
  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};

const deleteUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid user id');
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new Error('User not found');
  return true;
};

export const userModel = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
