/* eslint-disable no-unreachable */
/* eslint-disable no-useless-catch */

import { ObjectId } from "mongodb";
import { commentModel } from "~/models/commentModel";
import { postModel } from "~/models/postModel";
import { userModel } from "~/models/userModel";

const createComment = async (reqBody) => {
  try {
    const { userId, content, postId } = reqBody;
    console.log("body in service", reqBody);

    const user = await userModel.findUserById(userId);

    // check 1 user comment 1 lan
    const post = await postModel.findPostById(new ObjectId(postId));
    console.log("find post to comment service", post);

    if (!post) {
      throw new Error("Post not found");
    }
    const alreadyCommented = post.comments.some(
      (comment) => comment.author.toString() === userId.toString()
    );
    console.log("alreadycomment", alreadyCommented);

    if (alreadyCommented) {
      throw new Error("You already comment!");
    }

    // Call model insert
    const createComment = await commentModel.createComment(
      user.username,
      reqBody
    );

    const findComment = await commentModel.findCommentById(
      createComment.insertedId
    );

    return findComment;
  } catch (error) {
    throw error;
  }
};

const updateComment = async (id, body) => {
  try {
    const updateComment = await commentModel.updateComment(id, body);

    const postComment = await postModel.updatePostComment(id, body);

    console.log("updat ccomment", updateComment);
    console.log("updat  comment in post", postComment);
    return updateComment;
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (id) => {
  try {
    const deleteComment = await commentModel.deleteComment(id);

    console.log("delete  comment in post", deleteComment);
    return deleteComment;
  } catch (error) {
    throw error;
  }
};

const getDetail = async (id) => {
  try {
    const getDetail = await commentModel.findCommentById(new ObjectId(id));
    return getDetail;
  } catch (error) {
    throw error;
  }
};

export const commentService = {
  createComment,
  updateComment,
  deleteComment,
  getDetail,
};
