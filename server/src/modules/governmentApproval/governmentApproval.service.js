import path from "path";

import Village from "../../models/Village.model.js";
import {
  deletePrivateFile,
  getSignedFileUrl,
  uploadPrivateFile,
} from "../../services/s3.service.js";
import ApiError from "../../utils/ApiError.js";
import GovernmentApproval from "./GovernmentApproval.model.js";

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");

const hasOwn = (value, key) =>
  Object.prototype.hasOwnProperty.call(value, key);

const toBoolean = (value) =>
  value === true || value === "true";

const findApprovalOrThrow = async (id) => {
  const approval = await GovernmentApproval.findById(id)
    .populate("village", "name slug district state")
    .populate("createdBy", "username email")
    .populate("updatedBy", "username email");

  if (!approval) {
    throw new ApiError(
      404,
      "Government approval document not found."
    );
  }

  return approval;
};

const toSafeApproval = async (approval) => {
  const item = approval.toObject
    ? approval.toObject()
    : approval;

  const [viewUrl, downloadUrl] = await Promise.all([
    getSignedFileUrl({
      key: item.file.publicId,
      fileName: item.file.originalName,
      mimeType: item.file.mimeType,
      disposition: "inline",
    }),
    getSignedFileUrl({
      key: item.file.publicId,
      fileName: item.file.originalName,
      mimeType: item.file.mimeType,
      disposition: "attachment",
    }),
  ]);

  return {
    _id: item._id,
    village: item.village,
    title: item.title,
    description: item.description,
    showOnWebsite: item.showOnWebsite,
    file: {
      originalName: item.file.originalName,
      mimeType: item.file.mimeType,
      extension: item.file.extension,
      size: item.file.size,
    },
    viewUrl,
    downloadUrl,
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

const toPublicApproval = async (approval) => {
  const item = await toSafeApproval(approval);

  return {
    _id: item._id,
    title: item.title,
    description: item.description,
    file: item.file,
    viewUrl: item.viewUrl,
    downloadUrl: item.downloadUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

export const createGovernmentApproval = async ({
  payload,
  file,
  adminId,
}) => {
  if (!file) {
    throw new ApiError(
      400,
      "Please select an approval document to upload."
    );
  }

  const village = await Village.findById(payload.village);

  if (!village) {
    throw new ApiError(404, "Village not found.");
  }

  let uploadedFile;
  let approval;

  try {
    uploadedFile = await uploadPrivateFile({
      file,
      folder: `government-approvals/${village._id}`,
    });

    approval = await GovernmentApproval.create({
      village: village._id,
      title: payload.title || "",
      description: payload.description || "",
      showOnWebsite: toBoolean(
        payload.showOnWebsite
      ),
      file: {
        originalName: file.originalname,
        filename: uploadedFile.filename,
        publicId: uploadedFile.publicId,
        mimeType: uploadedFile.mimeType,
        extension: path
          .extname(file.originalname)
          .toLowerCase(),
        size: uploadedFile.size,
      },
      createdBy: adminId,
      updatedBy: adminId,
    });
  } catch (error) {
    if (uploadedFile?.publicId) {
      await deletePrivateFile(uploadedFile.publicId).catch(
        () => undefined
      );
    }

    throw error;
  }

  await approval.populate(
    "village",
    "name slug district state"
  );

  return toSafeApproval(approval);
};

export const updateGovernmentApproval = async ({
  id,
  payload,
  file,
  adminId,
}) => {
  const approval = await findApprovalOrThrow(id);
  const previousFileKey = approval.file.publicId;
  let uploadedFile;

  try {
    if (file) {
      uploadedFile = await uploadPrivateFile({
        file,
        folder: `government-approvals/${approval.village._id}`,
      });

      approval.file = {
        originalName: file.originalname,
        filename: uploadedFile.filename,
        publicId: uploadedFile.publicId,
        mimeType: uploadedFile.mimeType,
        extension: path
          .extname(file.originalname)
          .toLowerCase(),
        size: uploadedFile.size,
      };
    }

    if (hasOwn(payload, "title")) {
      approval.title = payload.title || "";
    }
    if (hasOwn(payload, "description")) {
      approval.description = payload.description || "";
    }
    if (hasOwn(payload, "showOnWebsite")) {
      approval.showOnWebsite = toBoolean(
        payload.showOnWebsite
      );
    }

    approval.updatedBy = adminId;
    await approval.save();
  } catch (error) {
    if (uploadedFile?.publicId) {
      await deletePrivateFile(uploadedFile.publicId).catch(
        () => undefined
      );
    }

    throw error;
  }

  if (
    uploadedFile?.publicId &&
    previousFileKey !== uploadedFile.publicId
  ) {
    await deletePrivateFile(previousFileKey).catch(
      () => undefined
    );
  }

  return toSafeApproval(approval);
};

export const deleteGovernmentApproval = async (id) => {
  const approval = await findApprovalOrThrow(id);

  await deletePrivateFile(approval.file.publicId);
  await approval.deleteOne();

  return true;
};

export const getGovernmentApprovalById = async (id) => {
  const approval = await findApprovalOrThrow(id);
  return toSafeApproval(approval);
};

export const getGovernmentApprovals = async (
  query = {}
) => {
  const {
    village,
    search,
    showOnWebsite,
    page = 1,
    limit = 25,
  } = query;
  const filter = {};

  if (village) filter.village = village;
  if (showOnWebsite !== undefined) {
    filter.showOnWebsite = showOnWebsite === "true";
  }
  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      {
        description: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        "file.originalName": {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [approvals, total] = await Promise.all([
    GovernmentApproval.find(filter)
      .populate("village", "name slug district state")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    GovernmentApproval.countDocuments(filter),
  ]);

  return {
    data: await Promise.all(
      approvals.map(toSafeApproval)
    ),
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const getPublicGovernmentApprovals = async (
  villageSlug
) => {
  const village = await Village.findOne({
    slug: villageSlug,
    isPublished: true,
    status: "ACTIVE",
    isActive: true,
  }).select("_id name slug");

  if (!village) {
    throw new ApiError(404, "Village not found.");
  }

  const approvals = await GovernmentApproval.find({
    village: village._id,
    showOnWebsite: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return Promise.all(
    approvals.map(toPublicApproval)
  );
};
