import express from "express";
import { reportController } from "~/controllers/reportController";
import { reportValidation } from "~/validations/reportValidation";

const Router = express.Router();

Router.route("/").post(
  reportValidation.sendReport,
  reportController.sendReport
);

export const reportRoutes = Router;
