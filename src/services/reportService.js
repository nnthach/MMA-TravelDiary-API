/* eslint-disable no-unreachable */
/* eslint-disable no-useless-catch */

import { reportModel } from "~/models/reportModel";

const sendReport = async (reqBody) => {
  try {
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
