import path from "path";
import TrainingManual from "./TrainingManual.model.js";
import { deletePrivateFile, getSignedFileUrl, uploadPrivateFile } from "../../services/s3.service.js";
import ApiError from "../../utils/ApiError.js";

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const bool = (value) => value === true || value === "true";

const findManual = async (id) => {
  const manual = await TrainingManual.findById(id);
  if (!manual) throw new ApiError(404, "Training manual not found.");
  return manual;
};

const fileResponse = async (file) => ({
  _id: file._id,
  originalName: file.originalName,
  mimeType: file.mimeType,
  extension: file.extension,
  size: file.size,
  uploadedAt: file.uploadedAt,
  viewUrl: await getSignedFileUrl({ key: file.publicId, fileName: file.originalName, mimeType: file.mimeType }),
  downloadUrl: await getSignedFileUrl({ key: file.publicId, fileName: file.originalName, mimeType: file.mimeType, disposition: "attachment" }),
});

const response = async (manual) => ({
  _id: manual._id,
  technologyName: manual.technologyName,
  description: manual.description,
  published: manual.published,
  files: await Promise.all(manual.files.map(fileResponse)),
  createdAt: manual.createdAt,
  updatedAt: manual.updatedAt,
});

const uploadFiles = async (files = [], manualId) => {
  const uploaded = [];
  try {
    for (const file of files) {
      const stored = await uploadPrivateFile({ file, folder: `training-manuals/${manualId}` });
      uploaded.push({ originalName: file.originalname, filename: stored.filename, publicId: stored.publicId, mimeType: stored.mimeType, extension: path.extname(file.originalname).toLowerCase(), size: stored.size });
    }
    return uploaded;
  } catch (error) {
    await Promise.all(uploaded.map((file) => deletePrivateFile(file.publicId).catch(() => undefined)));
    throw error;
  }
};

export const create = async ({ payload, files, adminId }) => {
  const manual = await TrainingManual.create({ technologyName: payload.technologyName, description: payload.description || "", published: hasOwn(payload, "published") ? bool(payload.published) : true, createdBy: adminId, updatedBy: adminId });
  let uploaded = [];
  try {
    uploaded = await uploadFiles(files, manual._id);
    manual.files.push(...uploaded);
    await manual.save();
  } catch (error) {
    await Promise.all(uploaded.map((file) => deletePrivateFile(file.publicId).catch(() => undefined)));
    await manual.deleteOne();
    throw error;
  }
  return response(manual);
};

export const update = async ({ id, payload, files, adminId }) => {
  const manual = await findManual(id);
  if (hasOwn(payload, "technologyName")) manual.technologyName = payload.technologyName;
  if (hasOwn(payload, "description")) manual.description = payload.description || "";
  if (hasOwn(payload, "published")) manual.published = bool(payload.published);
  const uploaded = await uploadFiles(files, manual._id);
  try {
    manual.files.push(...uploaded);
    manual.updatedBy = adminId;
    await manual.save();
  } catch (error) {
    await Promise.all(uploaded.map((file) => deletePrivateFile(file.publicId).catch(() => undefined)));
    throw error;
  }
  return response(manual);
};

export const removeFile = async (id, fileId) => {
  const manual = await findManual(id);
  const file = manual.files.id(fileId);
  if (!file) throw new ApiError(404, "Training manual file not found.");
  await deletePrivateFile(file.publicId);
  file.deleteOne();
  await manual.save();
  return response(manual);
};

export const remove = async (id) => {
  const manual = await findManual(id);
  await Promise.all(manual.files.map((file) => deletePrivateFile(file.publicId)));
  await manual.deleteOne();
};

export const getPublic = async () => Promise.all((await TrainingManual.find({ published: true }).sort({ createdAt: -1 })).map(response));
export const getPublicById = async (id) => {
  const manual = await TrainingManual.findOne({ _id: id, published: true });
  if (!manual) throw new ApiError(404, "Training manual not found.");
  return response(manual);
};
export const getAll = async () => Promise.all((await TrainingManual.find().sort({ createdAt: -1 })).map(response));
export const getById = async (id) => response(await findManual(id));
