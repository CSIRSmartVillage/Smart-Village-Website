import {
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import path from "path";

import s3Client from "../config/aws.js";

const BUCKET = process.env.AWS_S3_BUCKET;
const PRIVATE_BUCKET =
  process.env.AWS_PRIVATE_S3_BUCKET || BUCKET;

const generateObjectKey = (
  originalName,
  folder = "media",
  date = new Date()
) => {
  const ext = path.extname(originalName);

  const uploadDate = new Date(date);

  const year = uploadDate.getFullYear();

  const month = String(
    uploadDate.getMonth() + 1
  ).padStart(2, "0");

  return `${folder}/${year}/${month}/${uuidv4()}${ext}`;
};

export const uploadFile = async ({
  file,
  folder = "media",
  date,
}) => {
const key = generateObjectKey(
  file.originalname,
  folder,
  date
);

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await new Upload({
    client: s3Client,
    params,
  }).done();

  return {
    filename: key.split("/").pop(),
    publicId: key,
    url: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    resourceType: file.mimetype.split("/")[0],
    mimeType: file.mimetype,
    size: file.size,
  };
};

export const deleteFile = async (key) => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
};

export const deletePrivateFile = async (key) => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: PRIVATE_BUCKET,
      Key: key,
    })
  );
};

export const uploadPrivateFile = async ({
  file,
  folder = "private",
  date,
}) => {
  const key = generateObjectKey(
    file.originalname,
    folder,
    date
  );

  await new Upload({
    client: s3Client,
    params: {
      Bucket: PRIVATE_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "private, no-store",
      ServerSideEncryption: "AES256",
      Metadata: {
        access: "private",
      },
    },
  }).done();

  return {
    filename: key.split("/").pop(),
    publicId: key,
    resourceType: "document",
    mimeType: file.mimetype,
    size: file.size,
  };
};

const sanitizeFileName = (value) =>
  String(value || "document")
    .replace(/[\r\n"\\]/g, "_")
    .replace(/[^\x20-\x7E]/g, "_");

export const getSignedFileUrl = async ({
  key,
  fileName,
  mimeType,
  disposition = "inline",
  expiresIn = 300,
}) => {
  const safeFileName = sanitizeFileName(fileName);
  const contentDisposition =
    disposition === "attachment"
      ? "attachment"
      : "inline";

  const command = new GetObjectCommand({
    Bucket: PRIVATE_BUCKET,
    Key: key,
    ResponseContentType:
      mimeType || "application/octet-stream",
    ResponseContentDisposition:
      `${contentDisposition}; filename="${safeFileName}"`,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn,
  });
};
