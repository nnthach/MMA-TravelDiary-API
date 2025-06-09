// Define collection (name and schema)

import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const REPORT_COLLECTION_NAME = "reports";
// Define the schema for the user collection
const REPORT_COLLECTION_SCHEMA = Joi.object({
  postId: Joi.string().required(),
  // reporterId: Joi.string().required(),
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

    return sendReport;
  } catch (error) {
    throw new Error(error);
  }
};

export const reportModel = {
  REPORT_COLLECTION_NAME,
  REPORT_COLLECTION_SCHEMA,
  sendReport,
};
