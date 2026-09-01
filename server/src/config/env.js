import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV,

  port: process.env.PORT,

  mongoUri: process.env.MONGODB_URI,

  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,

  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY,

  clientUrl: process.env.CLIENT_URL,


  awsRegion: process.env.AWS_REGION,
awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
awsS3Bucket: process.env.AWS_S3_BUCKET,
awsPrivateS3Bucket: process.env.AWS_PRIVATE_S3_BUCKET,

  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,

  contactReceiver: process.env.CONTACT_RECEIVER,

  superAdminUsername: process.env.SUPER_ADMIN_USERNAME,
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
};
