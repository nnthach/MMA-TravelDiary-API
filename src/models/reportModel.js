// Define collection (name and schema)
import Joi, { date } from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import { postModel } from "~/models/postModel";

const REPORT_COLLECTION_NAME = "reports";
// Define the schema for the user collection
const REPORT_COLLECTION_SCHEMA = Joi.object({
  postId: Joi.string().required(),
  reporterId: Joi.string().required(),
  reason: Joi.string().required(),
  description: Joi.string().max(200).required(),
  status: Joi.string().default("pending"),
  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  updatedBy: Joi.string().default(""),
});

// Validate data before creating a new user
const validateBeforeCreate = async (data) => {
  return await REPORT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const sendReport = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    const sendReport = await GET_DB()
      .collection(REPORT_COLLECTION_NAME)
      .insertOne(validData);
    console.log("send report modal result", sendReport);

    return sendReport;
  } catch (error) {
    throw new Error(error);
  }
};
const findOne = async (data) => {
  try {
    const findOne = await GET_DB()
      .collection(REPORT_COLLECTION_NAME)
      .findOne(data);
    return findOne;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllReport = async (query = {}) => {
  try {
    const getAllReport = await GET_DB()
      .collection(REPORT_COLLECTION_NAME)
      .aggregate([
        { $match: query },
        {
          $addFields: {
            postId: { $toObjectId: "$postId" }, //convert id to object
          },
        },
        {
          $lookup: {
            from: postModel.POST_COLLECTION_NAME,
            localField: "postId",
            foreignField: "_id",
            as: "postInfo",
          },
        },
        {
          $unwind: "$postInfo", // lookup lay theo [] => unwind giup chuyen thanh {} vi chi co 1
        },
      ])
      .toArray();
    console.log("get all report model", getAllReport);
    return getAllReport;
  } catch (error) {
    throw new Error(error);
  }
};
const getReportDetail = async (id) => {
  try {
    const getReportDetail = await GET_DB()
      .collection(REPORT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id), // tim theo report id
          },
        },
        {
          $addFields: {
            postId: { $toObjectId: "$postId" }, //convert id to object
          },
        },
        {
          $lookup: {
            from: postModel.POST_COLLECTION_NAME,
            localField: "postId",
            foreignField: "_id",
            as: "postInfo",
          },
        },
        {
          $unwind: "$postInfo", // lookup lay theo [] => unwind giup chuyen thanh {} vi chi co 1
        },
      ])
      .toArray();
    console.log("get report detail model", getReportDetail);
    return getReportDetail[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const updateReport = async (id, body) => {
  const { action, updateBy } = body;
  try {
    const report = await GET_DB()
      .collection(REPORT_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    console.log("report found in model", report);

    if (action === "accepted") {
      const updateReport = await GET_DB()
        .collection(REPORT_COLLECTION_NAME)
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: {
              status: "accepted",
              updatedBy: updateBy,
              updatedAt: Date.now(),
            },
          }
        );
      console.log("update report accept", updateReport);
      const updatePost = await GET_DB()
        .collection(postModel.POST_COLLECTION_NAME)
        .updateOne(
          { _id: new ObjectId(report.postId) },
          {
            $set: {
              isBanned: true,
              public: false,
            },
          }
        );
      console.log("update post banned", updatePost);
      return { message: "Report accepted" };
    } else if (action === "rejected") {
      const updateReport = await GET_DB()
        .collection(REPORT_COLLECTION_NAME)
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: {
              status: "rejected",
              updatedBy: updateBy,
              updatedAt: Date.now(),
            },
          }
        );
      console.log("update report reject", updateReport);
      return { message: "Report rejected" };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const reportModel = {
  REPORT_COLLECTION_NAME,
  REPORT_COLLECTION_SCHEMA,
  sendReport,
  findOne,
  getAllReport,
  getReportDetail,
  updateReport,
};
