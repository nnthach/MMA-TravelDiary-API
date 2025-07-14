/* eslint-disable no-unreachable */
/* eslint-disable no-useless-catch */

import { postModel } from "~/models/postModel";
import { reportModel } from "~/models/reportModel";
import { ObjectId } from "mongodb";

const sendReport = async (reqBody) => {
  try {
    const { postId, reporterId } = reqBody;
    const existingReport = await reportModel.findOne({
      postId,
      reporterId,
    });

    if (existingReport) {
      throw new Error("You have already reported this post.");
    }

    // Call model
    await reportModel.sendReport(reqBody);

    return {
      message: "Send report successfully",
    };
  } catch (error) {
    throw error;
  }
};

const getAllReport = async (reqQuery) => {
  const { status } = reqQuery;
  try {
    console.log("report get status", status);
    const query = {};
    if (status) {
      query.status = status;
    }
    // Call model
    const getAllReport = await reportModel.getAllReport(query);

    return getAllReport;
  } catch (error) {
    throw error;
  }
};

const getReportDetail = async (id) => {
  try {
    // Call model
    const getReportDetail = await reportModel.getReportDetail(id);

    return getReportDetail;
  } catch (error) {
    throw error;
  }
};

const updateReport = async (id, body) => {
  if (body.action != "accepted" && body.action != "rejected") {
    throw new Error("Wrong action type");
  }
  try {
    const getReportDetail = await reportModel.getReportDetail(new ObjectId(id));

    console.log("get report detail in update service", getReportDetail);

    const isPostAvailable = await postModel.findPostById(
      new ObjectId(getReportDetail.postId)
    );

    if (!isPostAvailable) {
      throw new Error("This post is not exist");
    }

    // Call model
    const updateReportResult = await reportModel.updateReport(id, body);

    return updateReportResult;
  } catch (error) {
    throw error;
  }
};

export const reportService = {
  sendReport,
  getAllReport,
  updateReport,
  getReportDetail,
};
