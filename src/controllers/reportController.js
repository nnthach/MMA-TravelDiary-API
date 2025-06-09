import { reportService } from "~/services/reportService";

const { StatusCodes } = require("http-status-codes");

const sendReport = async (req, res, next) => {
  try {
    const sendReport = await reportService.sendReport(req.body);
    res.status(StatusCodes.OK).json(sendReport);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const reportController = {
  sendReport,
};
