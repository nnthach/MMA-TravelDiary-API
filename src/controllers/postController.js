import { StatusCodes } from "http-status-codes";
import { postService } from "~/services/postService";
import { ObjectId } from "mongodb";

const createPost = async (req, res, next) => {
  try {
    const createdPost = await postService.createPost(req.body);

    res.status(StatusCodes.CREATED).json(createdPost);
  } catch (error) {
    next(error);
  }
};

const getAllPost = async (req, res, next) => {
  console.log("req.query", req.query);

  try {
    const getAllPost = await postService.getAllPost(req.query);

    res.status(StatusCodes.OK).json(getAllPost);
  } catch (error) {
    next(error);
  }
};

const findPostById = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const foundPost = await postService.findPostById(postId);

    if (!foundPost) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    res.status(StatusCodes.OK).json(foundPost);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    console.log("postid need update", postId);
    console.log("data update post", req.body);

    const objectId = new ObjectId(postId);
    const getPostById = await postService.findPostById(objectId);
    console.log("find post by id", getPostById);
    if (getPostById.userId != req.body.userId) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user" });
    }

    const updatedPost = await postService.updatePost(postId, req.body);

    res.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const deleted = await postService.deletePost(postId);

    if (!deleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

const postDetail = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const detail = req.body;

    const updatedPost = await postService.postDetail(postId, detail);

    if (!updatedPost) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    res.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

const getAllPostOfUserAndPublic = async (req, res, next) => {
  console.log("req.query", req.query);
  try {
    const getAllPostOfUserAndPublic =
      await postService.getAllPostOfUserAndPublic(req.params.id, req.query);

    res.status(StatusCodes.OK).json(getAllPostOfUserAndPublic);
  } catch (error) {
    next(error);
  }
};
const toggleLikePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;

    if (!postId || !userId) {
      return res.status(400).json({ message: "Thiếu postId hoặc userId" });
    }

    const updatedPost = await postService.toggleLikePost(postId, userId);

    res.status(200).json({ likes: updatedPost.likes });
  } catch (error) {
    console.error("Lỗi toggleLikePost:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const searchPosts = async (req, res, next) => {
  try {
    const result = await postService.searchPosts(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


export const postController = {
  createPost,
  getAllPost,
  findPostById,
  updatePost,
  deletePost,
  postDetail,
  getAllPostOfUserAndPublic,
  toggleLikePost,
  searchPosts
};
