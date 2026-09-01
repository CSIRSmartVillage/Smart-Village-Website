import multer from "multer";
import path from "path";

import ApiError
  from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const videoMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const videoExtensions = [
  ".mp4",
  ".webm",
  ".mov",
];

const fileFilter = (
  req,
  file,
  cb
) => {
  const isImage =
    file.mimetype.startsWith(
      "image/"
    );

  const isVideo =
    videoMimeTypes.includes(
      file.mimetype
    ) &&
    videoExtensions.includes(
      path.extname(
        file.originalname
      ).toLowerCase()
    );

  const isPdf =
    file.mimetype ===
    "application/pdf";

  if (
    isImage ||
    isVideo ||
    isPdf
  ) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        "Only images, MP4, WebM, MOV and PDF files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:
      Number(
        process.env.MAX_MEDIA_FILE_SIZE_MB ||
          250
      ) *
      1024 *
      1024,
  },
});

const approvalMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
]);

const approvalExtensions = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tif",
  ".tiff",
]);

const approvalFileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    approvalMimeTypes.has(file.mimetype) &&
    approvalExtensions.has(extension)
  ) {
    cb(null, true);
    return;
  }

  cb(
    new ApiError(
      415,
      "Only PDF, Word and supported image files are allowed"
    )
  );
};

export const governmentApprovalUpload = multer({
  storage,
  fileFilter: approvalFileFilter,
  limits: {
    fileSize:
      Number(
        process.env.MAX_APPROVAL_FILE_SIZE_MB ||
          process.env.MAX_MEDIA_FILE_SIZE_MB ||
          250
      ) *
      1024 *
      1024,
  },
});

export default upload;
