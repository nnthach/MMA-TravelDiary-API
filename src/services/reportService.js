/* eslint-disable no-unreachable */
/* eslint-disable no-useless-catch */

import { reportModel } from "~/models/reportModel";

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

export const reportService = {
  sendReport,
};
