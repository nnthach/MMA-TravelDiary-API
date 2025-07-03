import express from "express";
import { reportController } from "~/controllers/reportController";
import { reportValidation } from "~/validations/reportValidation";

const Router = express.Router();

Router.route("/")
  .get(reportController.getAllReport)
  .post(reportValidation.sendReport, reportController.sendReport);

Router.route("/:id")
  .get(reportController.getReportDetail)
  .put(reportController.updateReport);

export const reportRoutes = Router;
