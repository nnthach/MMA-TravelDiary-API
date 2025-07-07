import { commentService } from "~/services/commentService";

const { StatusCodes } = require("http-status-codes");

const createComment = async (req, res, next) => {
  try {
    console.log("comment controller");

    const createComment = await commentService.createComment(req.body);

    console.log("creat comment resultt", createComment);

    res.status(StatusCodes.CREATED).json(createComment);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "An error occurred while creating comment",
    });
  }
};

const updateComment = async (req, res, next) => {
  try {
    console.log("comment update controller body", req.body);
    console.log("comment update controller id", req.params.id);

    const updateComment = await commentService.updateComment(
      req.params.id,
      req.body
    );

    res.status(StatusCodes.OK).json(updateComment);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    console.log("comment delete controller id", req.params);

    const deleteComment = await commentService.deleteComment(req.params.id);

    res.status(StatusCodes.NO_CONTENT).json(deleteComment);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const getDetail = await commentService.getDetail(req.params.id);
    res.status(StatusCodes.OK).json(getDetail);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const commentController = {
  createComment,
  updateComment,
  deleteComment,
  getDetail,
};
