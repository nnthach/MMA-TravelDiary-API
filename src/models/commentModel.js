// Define collection (name and schema)
import Joi, { date } from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import { postModel } from "~/models/postModel";
import { userModel } from "~/models/userModel";

const COMMENT_COLLECTION_NAME = "comments";
// Define the schema for the user collection
const COMMENT_COLLECTION_SCHEMA = Joi.object({
  post: Joi.string().required(),
  author: Joi.string().required(),
  authorName: Joi.string().required(),
  content: Joi.string().required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const createComment = async (username, body) => {
  try {
    const createComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .insertOne({
        post: new ObjectId(body.postId),
        author: new ObjectId(body.userId),
        authorName: username,
        content: body.content,
      });
    console.log("create comment modal result", createComment);

    // 2. Lấy comment vừa insert
    const insertCommentToPostData = {
      _id: createComment.insertedId,
      post: new ObjectId(body.postId),
      author: new ObjectId(body.userId),
      authorName: username,
      content: body.content,
      createdAt: new Date(),
      updatedAt: null,
    };

    // 3. Push comment vào field `comments[]` trong post
    const insertCommentToPost = await GET_DB()
      .collection(postModel.POST_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(body.postId) },
        { $push: { comments: insertCommentToPostData } }
      );
    console.log("insertCommentToPost", insertCommentToPost);

    return createComment;
  } catch (error) {
    throw new Error(error);
  }
};

const findCommentById = async (id) => {
  try {
    const foundComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOne({ _id: id });

    return foundComment;
  } catch (error) {
    throw new Error(error);
  }
};

const updateComment = async (id, body) => {
  try {
    const updateComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...body,
            updatedAt: new Date(),
          },
        }
      );
    console.log("update comment model", updateComment);

    return updateComment;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteComment = async (id) => {
  try {
    const comment = await findCommentById(new ObjectId(id));

    const deleteComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    await GET_DB()
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(comment.postId) },
        { $pull: { comments: { _id: new ObjectId(id) } } }
      );

    console.log("delete comment", deleteComment);
    return deleteComment;
  } catch (error) {
    throw new Error(error);
  }
};
export const commentModel = {
  COMMENT_COLLECTION_NAME,
  COMMENT_COLLECTION_SCHEMA,
  createComment,
  findCommentById,
  updateComment,
  deleteComment,
};
