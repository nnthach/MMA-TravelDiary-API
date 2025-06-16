import Joi from "joi";
import { GET_DB } from "~/config/mongodb";  // Đảm bảo bạn đã cấu hình MongoDB đúng
import { ObjectId } from "mongodb";

// Define collection (name and schema)
const POST_COLLECTION_NAME = "posts";

// Define the schema for the post collection
const POST_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  username: Joi.string().required(),
  title: Joi.string().min(6).max(50).required(),
  content: Joi.string().max(1000).required().strict(),
  images: Joi.array().items(Joi.string()).default([]),
  slug: Joi.string().optional(),
  location: Joi.string().optional(),
  province: Joi.string().optional(),  // Added for province
  district: Joi.string().optional(),  // Added for district
  ward: Joi.string().optional(),     // Added for ward
  address: Joi.string().optional(),  // Added for address
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  public: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

// Validate data before creating a new post
const validateBeforeCreate = async (data) => {
  try {
    return await POST_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
    });
  } catch (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }
};

// Create a new post
const createPost = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    // Store the post in the database
    const createdPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .insertOne(validData);

    return createdPost;
  } catch (error) {
    throw new Error("Error while creating post: " + error.message);
  }
};

// Find post by ID
const findPostById = async (id) => {
  try {
    const foundPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    return foundPost || null;
  } catch (error) {
    throw new Error(`Error fetching post by ID: ${error.message}`);
  }
};

// Get all posts
const getAllPosts = async () => {
  try {
    const posts = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find()
      .toArray();

    return posts;
  } catch (error) {
    throw new Error(`Error fetching all posts: ${error.message}`);
  }
};

// Update a post
const updatePost = async (id, updateData) => {
  try {
    const newUpdateData = {
      ...updateData,
      updatedAt: new Date(),
    };

    const updatedPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: newUpdateData },
        { returnDocument: "after" }
      );

    return updatedPost.value || null;
  } catch (error) {
    throw new Error(`Error updating post: ${error.message}`);
  }
};

// Delete a post
const deletePost = async (id) => {
  try {
    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  } catch (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }
};

// Add details to a post
const postDetail = async (postId, detail) => {
  try {
    const detailWithDate = {
      ...detail,
      date: new Date(detail.date),
    };

    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(postId) },
        {
          $push: { postDetails: detailWithDate },
          $set: { updatedAt: Date.now() },
        },
        { returnDocument: "after" }
      );

    return result.value || null;
  } catch (error) {
    throw new Error(`Error updating post details: ${error.message}`);
  }
};

// Find multiple posts by their IDs
const findAllPostInStorage = async (ids) => {
  try {
    const foundPostList = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
      .toArray();

    return foundPostList;
  } catch (error) {
    throw new Error(`Error fetching posts by IDs: ${error.message}`);
  }
};

export const postModel = {
  POST_COLLECTION_NAME,
  POST_COLLECTION_SCHEMA,
  createPost,
  findPostById,
  getAllPosts,
  updatePost,
  deletePost,
  postDetail,
  findAllPostInStorage,
};
