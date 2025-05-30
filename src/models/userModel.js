// Define collection (name and schema)

const Joi = require("joi");

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().min(6).max(20).required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  slug: Joi.string().optional(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
};
