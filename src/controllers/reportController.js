import { reportService } from "~/services/reportService";

const { StatusCodes } = require("http-status-codes");

const sendReport = async (req, res, next) => {
  try {
    console.log("send report controller");

    const sendReport = await reportService.sendReport(req.body);
    res.status(StatusCodes.CREATED).json(sendReport);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getAllReport = async (req, res, next) => {
  try {
    console.log("get all report controller");

    const getAllReport = await reportService.getAllReport(req.query);
    res.status(StatusCodes.OK).json(getAllReport);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getReportDetail = async (req, res, next) => {
  try {
    console.log("get report detail controller", req.params.id);

    const getReportDetail = await reportService.getReportDetail(req.params.id);
    res.status(StatusCodes.OK).json(getReportDetail);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateReport = async (req, res, next) => {
  try {
    console.log("get report detail controller", req.params.id);
    console.log("get body report", req.body)

    const updateReport = await reportService.updateReport(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json(updateReport);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const reportController = {
  sendReport,
  getAllReport,
  getReportDetail,
  updateReport,
};
