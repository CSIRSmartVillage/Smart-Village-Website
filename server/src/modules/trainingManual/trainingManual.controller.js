import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import * as service from "./trainingManual.service.js";

const send = (status, message, getData) => asyncHandler(async (req, res) => res.status(status).json(new ApiResponse(status, await getData(req), message)));
export const getPublic = send(200, "Training manuals fetched successfully.", () => service.getPublic());
export const getPublicById = send(200, "Training manual fetched successfully.", (req) => service.getPublicById(req.params.id));
export const getAll = send(200, "Training manuals fetched successfully.", () => service.getAll());
export const getById = send(200, "Training manual fetched successfully.", (req) => service.getById(req.params.id));
export const create = send(201, "Training manual created successfully.", (req) => service.create({ payload: req.body, files: req.files, adminId: req.admin._id }));
export const update = send(200, "Training manual updated successfully.", (req) => service.update({ id: req.params.id, payload: req.body, files: req.files, adminId: req.admin._id }));
export const removeFile = send(200, "Training manual file deleted successfully.", (req) => service.removeFile(req.params.id, req.params.fileId));
export const remove = send(200, "Training manual deleted successfully.", async (req) => { await service.remove(req.params.id); return null; });
