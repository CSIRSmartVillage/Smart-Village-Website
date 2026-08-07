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

export default upload;